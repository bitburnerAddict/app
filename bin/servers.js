/**
 * servers.js - Server functions
 * ==============================================
 * Gain access, purchase, run scripts and remove 
 * purchased servers 
 * 
 */

import * as search from "./bin/search";
import * as hack from "./bin/hack"; 
import * as messages from './bin/messages';
import * as security from './bin/security';
import * as appInterface from './bin/appInterface';

/**
 * Bulk purchase servers
 * 
 */
export async function purchaseServers(ns) {
    let i = 0, 
        ram = 8;

    while(i < ns.getPurchasedServerLimit()){
        if(ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(ram)) {
            let hostname = appInterface.getServerPattern() + i;
            await purchase(ns, hostname, ram)					
            i++;
        }
    }
}

/**
 * Purchase a server and run script
 * 
 */
export async function purchase(ns, hostname, ram){
    let servers = ns.scan('home');
    if(servers.includes(hostname)) { 
        return false; 
    }

    try {
        hostname = ns.purchaseServer(hostname, ram);
        await run(ns, hostname, appInterface.getScript());
        return true;
    } catch(err){
        ns.tprint(err);
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

/**
 * Access servers
 * 
 */
export async function access(ns) {
    let servers = await search.main(ns);
    for( let i = 0; i < servers.length; i++ ) {
        await hack.run(servers[i], ns);
    }
}

/**
 * Find most efficient server to hack
 * 
 */
export async function getTarget(ns){
    let servers = await search.main(ns), efficency = {};

    efficency.current   = 0;
    efficency.highest   = 0;
        
    for( let i = 0; i < servers.length; i++ ) {
        let data = await getEfficency(ns, servers[i]);        
        
        if(data.current > efficency.highest){
            efficency.highest = data.current;
            efficency.server = data.server;
            efficency.money = data.money;
        }
    }

    return efficency;
}

/**
 * Get targetEfficency
 * 
 */
export async function getEfficency(ns, server){

    let efficency = {};

    efficency.time          = {};
    efficency.time.hack     = ns.getHackTime(server);
    efficency.time.grow     = ns.getGrowTime(server);
    efficency.time.weaken   = ns.getWeakenTime(server);
    efficency.time.total    = efficency.time.hack + efficency.time.grow + efficency.time.weaken;
    efficency.money         = ns.getServerMoneyAvailable(server)
    efficency.server        = server;
    efficency.current       = 0;
    efficency.canHack       = await security.canHack(ns, ns.getServer(server));
    
    if(efficency.money > 0 && efficency.canHack) {
        efficency.current   = Math.ceil(efficency.money / efficency.time.total);
    }

    return efficency;
}

/**
 * Run script on server
 * 
 */
 export async function run(ns, server, script){
    if(server && !ns.scriptRunning(script, server)){
        ns.tprint(server);			
        await ns.scp(script, server);
        await ns.exec(script, server, 3);
    } else {
        messages.alreadyRunning(ns, server);
        return false;
    }
}


/** @param {NS} ns **/
export async function main(ns) {

}