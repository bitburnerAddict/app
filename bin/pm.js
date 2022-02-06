/**
 * pm.js - Process Manager
 * ============================================== 
 */

import * as resource from './bin/resource.js';
import * as messages from './bin/messages';
import * as security from './bin/security';
import * as appInterface from './bin/appInterface';

/**
 * Stop/Kill scripts on all servers
 *  
 * @param {NS} ns 
 */
export async function stop(ns, servers) {

    for( let i = 0; i < servers.length; i++ ) {
        await ns.killall(servers[i]);
    }
}

/**
 * Start all running scripts on all servers
 *  
 * @param {NS} ns 
 */
export async function start(ns, script, servers) {
    
    for( let i = 0; i < servers.length; i++ ) {
        let threads = resource.calculateThreads(ns, servers[i], script);

        try {
            if(threads <= 0){
                throw(messages.notEnoughThreads(servers[i]));
            }
            if(!ns.fileExists(script, servers[i])){
                throw(messages.noScriptFoundOnHost(servers[i]));
            }
            if(!security.canHack(ns, servers[i]) && servers[i].indexOf(appInterface.getServerPattern()) < 0){
               throw('ERROR: Unable to hack ' + servers[i] + ' - Hacking Level: ' + ns.getHackingLevel() +  '/' + ns.getServerRequiredHackingLevel(servers[i]));
            }
            if(ns.isRunning(script, servers[i])){
                throw(messages.alreadyRunning(servers[i]));
            }
            if(await ns.exec(
                script, 
                servers[i], 
                threads
            )){
                messages.log(ns, 'SUCCESS: Script run on ' + servers[i]);
            } else {
                messages.log(ns, 'ERROR: Running script on ' + servers[i]);
            }
        } catch(err) {
            messages.log(ns, err);
        }
    }
}

/** @param {NS} ns **/
export async function main(ns) {

}