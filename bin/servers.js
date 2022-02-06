/**
 * servers.js - Server functions
 * ==============================================
 * Gain access, purchase, run scripts and remove 
 * purchased servers 
 * 
 */

import * as security from './bin/security';
import * as appInterface from './bin/appInterface';
import * as messages from './bin/messages';
import * as time from './bin/time';

/**
 * Get Target server based on efficiency
 * 
 */
 export async function getTarget(ns, servers){

    let server,
        finalData,
        highest = 0;
        
    for( let i = 0; i < servers.length; i++ ) {
        let data = await getEfficency(ns, servers[i]);
        if(data.current > highest){
            highest = data.current;
            server = data.server;
            finalData = data;
        }        
    }
    return server;
}

/**
 * Get the efficiency for a given server
 * 
 */
export async function getEfficency(ns, server){

    let efficency = {};

    efficency.time              = {};
    efficency.time.hack         = ns.getHackTime(server);
    efficency.time.grow         = ns.getGrowTime(server);
    efficency.time.weaken       = ns.getWeakenTime(server);
    efficency.time.total        = efficency.time.hack + efficency.time.grow + efficency.time.weaken;
    efficency.time.formatted    = time.secondsToDhms(efficency.time.total/1000);
    efficency.money             = ns.getServerMoneyAvailable(server)
    efficency.server            = server;
    efficency.current           = 0;
    efficency.canHack           = security.canHack(ns, server);

    if(
        efficency.money > 0 && 
        efficency.canHack && 
        efficency.time.total < 86400000
    ) {
        efficency.current   = Math.ceil(efficency.money / efficency.time.total);
    }

    return efficency;
}

/**
 * Bulk purchase servers
 * 
 */
 export async function purchaseServers(ns, script) {
    let i = 0, 
        ram = 8,
        time = Date.now(),
        servers = ns.scan('home'), 
        purchasedServers = [];

    servers.forEach((server) => {
        if(!server.indexOf(appInterface.getServerPattern())){
            purchasedServers.push(server);
        }		
    });

    if(purchasedServers.length < ns.getPurchasedServerLimit()){
        while(i < ns.getPurchasedServerLimit()){
            if(ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(ram)) {
                let hostname = appInterface.getServerPattern() + time + '-' + i;
                await add(ns, hostname, ram, script);				
                i++;
            }
        }
    }    
}

/**
 * Purchase a server
 * 
 */
 export async function add(ns, hostname, ram, script){
    let servers = ns.scan('home');
    if(servers.includes(hostname)) { 
        return false; 
    }
    try {
        if(await ns.purchaseServer(hostname, ram)){
            await ns.scp(script, hostname);
            return true;
        } else {
            messages.log(ns, 'ERROR: Unable to purhcase ' + hostname);
        };
        return false;        
    } catch(err){
        messages.log(ns, err);
    }	
}

/**
 * Bulk remove servers
 * 
 */
 export async function remove(ns){
    let servers = ns.scan('home');
    servers.forEach((server) => {
        if(!server.indexOf(appInterface.getServerPattern())){
            ns.tprint('Removing: ' + server);
            ns.deleteServer(server);
        }		
    });
}

/** @param {NS} ns **/
export async function main(ns) {

}