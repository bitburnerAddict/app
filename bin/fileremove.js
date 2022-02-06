/**
 * fileremove.js - File Manager
 * ==============================================
 * Handles transferring files around the network
 * 
 */

import * as messages from './bin/messages';
import * as pm from './bin/pm';

/**
 * Remove file from servers
 * 
 * @param {NS} ns 
 * @param {*} server 
 * @param {*} file 
 */
export async function main(ns, file, servers) {
    await pm.stop(ns);
    for( let i = 0; i < servers.length; i++ ) {
        await ns.rm(file, servers[i]);
        messages.log(ns, messages.removedScripts(file, servers[i]));
    }
} 
