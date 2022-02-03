/**
 * servers.js - Server functions
 * ==============================================
 * Gain access, purchase, run scripts and remove 
 * purchased servers 
 * 
 */

import * as search from "/bin/search.js";
import * as hack from "/bin/hack.js"; 
import * as messages from '/bin/messages.js';

// Purchased Server naming convention
let serverNamingPattern = 'pserv-';

/**
 * Bulk purchase servers
 * ==============================================
 */
export async function purchaseServers(ns) {
    let i = 0, 
        ram = 8;

    while(i < ns.getPurchasedServerLimit()){
        if(ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(ram)) {
            let hostname = serverNamingPattern + i;
            await purchase(ns, hostname, ram)					
            i++;
        }
    }

}

/**
 * Bulk remove servers
 * ==============================================
 */
export async function remove(ns){
    let servers = ns.scan('home');
    servers.forEach((server) => {
        if(!server.indexOf(serverNamingPattern)){
            ns.tprint('Removing: ' + server);
            ns.deleteServer(server);
        }		
    });
}

/**
 * Purchase a server and run script
 * ==============================================
 */
export async function purchase(ns, hostname, ram){
    let servers = ns.scan('home');
    if(servers.includes(hostname)) { 
        return false; 
    }

    try {
        hostname = ns.purchaseServer(hostname, ram);
        await run(ns, hostname, '/scripts/hacks/early-hack-template.script');
        return true;
    } catch(err){
        ns.tprint(err);
    }	
}

/**
 * Run script on server
 * ==============================================
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

/**
 * Hack servers
 * ==============================================
 */
export async function hackServers(ns) {
    
    let servers = await search.main(ns);
    for( let i = 0; i < servers.length; i++ ) {
        await hack.run(servers[i], ns);
    }

    //targetServer = await getTargetServer(ns);
    //console.log(targetServer);
}

/**
 * Find most efficient server to hack
 * ==============================================
 */
export async function getTargetServer(ns){
    let servers = await search.main(ns),
        efficencies = [],
        target, 
        server;
        
    for( let i = 0; i < servers.length; i++ ) {
        let efficency = await getEfficency(ns, servers[i]);
        efficencies.push(efficency[1]);

        if(efficency[1] > Math.max(...efficencies)){
            target = efficency[1];
            server = servers[i];
        } 
    }

    return [server, target];
}

/**
 * Get targetEfficency
 * ==============================================
 */
export async function getEfficency(ns, server){

    let hackTime		= ns.getHackTime(server),
        growTime		= ns.getGrowTime(server),
        weakenTime		= ns.getWeakenTime(server),
        moneyAvailable 	= ns.getServerMoneyAvailable(server),
        totalTime		= hackTime + growTime + weakenTime,
        efficency		= Math.ceil(moneyAvailable / totalTime),
        efficencyReturn = [];	

    efficencyReturn[0] = server;
    efficencyReturn[1] = 0;
    efficencyReturn[2] = 0;
    efficencyReturn[3] = totalTime;
    
    if(moneyAvailable > 0){
        efficencyReturn[1] = efficency;
        efficencyReturn[2] = moneyAvailable;
        return efficencyReturn;
    }

    return efficencyReturn;

}

/** @param {NS} ns **/
export async function main(ns) {

}