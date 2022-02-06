/**
 * filemanager.js - File Manager
 * ==============================================
 * Handles transferring files around the network
 * 
 */

import * as fileremove from './bin/fileremove';
import * as fileupload from './bin/fileupload';

/**
 * Remove file from servers
 * 
 * @param {*} ns 
 * @param {*} server 
 * @param {*} file 
 */
export async function clean(ns, file, servers) {
    await fileremove.main(ns, file, servers);
}

/**
 * Upload file to servers
 * 
 * @param {*} ns 
 * @param {*} server 
 * @param {*} file 
 */
 export async function upload(ns, file, servers) {
    await fileupload.main(ns, file, servers);
}


/** @param {NS} ns **/
export async function main(ns) {

}