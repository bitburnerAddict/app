/**
 * generator.js - Script generator
 * ============================================== 
 */

import * as appInterface from './bin/appInterface';

/**
 * Generate hacking script with specified server
 *  
 * @param {*} ns 
 * @param {*} server 
 */
export async function hackScript(ns, server) {
    let script  = appInterface.getDynamicScript(),
        src     = await ns.read(appInterface.getEarlyHackingScript()),
        data    = src.replace(
        /var target = "[a-zA-Z0-9_]+"/, 
        'var target = "'+ server +'"');

    await ns.rm(script);
    await ns.write(script, data);
}

/** @param {NS} ns **/
export async function main(ns) {
}