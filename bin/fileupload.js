/**
 * fileupload.js - File Manager
 * ==============================================
 * Handles transferring files around the network
 * 
 */

import * as messages from './bin/messages';

/**
 * Upload file to servers
 * 
 * @param {*} ns 
 * @param {*} server 
 * @param {*} file 
 */
export async function main(ns, file, servers) {
    for( let i = 0; i < servers.length; i++ ) {
        if(ns.fileExists(file, 'home')){
            if(!ns.fileExists(file, servers[i])){
                await ns.scp(file, servers[i]);
                messages.log(ns, messages.uploadedScripts(file, servers[i]));
            } else {
                messages.log(ns, 'NOTICE: Skipping, file exists on ' + servers[i]);    
            }
        } else {
            messages.log(ns, 'ERROR: File not found on home');
        }
    }
}
