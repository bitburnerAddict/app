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
        src     = await ns.read(appInterface.getScript()),
        data    = src.replace(
        /var target = "[a-zA-Z0-9_]+"/, 
        'var target = "'+ server +'"');

    await ns.rm(script);
    await ns.write(script, data);
    console.log(ns.read(script));
}

/** @param {NS} ns **/
export async function main(ns) {
}