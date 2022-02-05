/**
 * pm.js - Process Manager
 * ============================================== 
 */

import * as appInterface from './bin/appInterface.js';
import * as resource from './bin/resource.js';
import * as search from './bin/search';

/**
 * Stop all running scripts on all servers
 *  
 * @param {NS} ns 
 */
export async function stop(ns) {
    let servers = await search.main(ns);
    for( let i = 0; i < servers.length; i++ ) {
        await ns.killall(servers[i]);
    }
}

/**
 * Start all running scripts on all servers
 *  
 * @param {NS} ns 
 */
export async function start(ns) {
    let servers = await search.main(ns);
    for( let i = 0; i < servers.length; i++ ) {
        let threads = await resource.calculateThreads(ns, servers[i], appInterface.getScript());
        if(threads > 0){
            if(await ns.exec(
                appInterface.getScript(), 
                servers[i], 
                threads
                )){ 
                    ns.tprint('SUCCESS: Running script on ' + servers[i]);
                } else {
                    ns.tprint('ERROR: Running script on ' + servers[i] + ', the script could already be running?');
                }
        }


    }
}

/** @param {NS} ns **/
export async function main(ns) {

}