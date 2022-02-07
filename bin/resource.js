/**
 * resource.js - Information about RAM/CPU etc
 * ==============================================
 */

/**
 * Get Available RAM on a server
 *  
 * @param {*} ns 
 * @param {*} server 
 * @returns float
 */
export function getAvailableServerRam(ns, server) {
    let availableServerRam = (ns.getServerMaxRam(server) - ns.getServerUsedRam(server));
    return availableServerRam;
}

/**
 * Calculate threads
 * 
 * @param {NS} ns 
 */
export function calculateThreads(ns, server, script) {
    return Math.floor(getAvailableServerRam(ns, server) / ns.getScriptRam(script));
}

export function calculatePotentialThreads(ns, server, script) {
    return Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam(script));
}

/**
 * Check if all 5 port opening ports are available
 * 
 * @param {*} ns 
 * @returns int
 */
export function getNumberOfPortsAvailableToOpen(ns) {
    let ports = 0;
    if(ns.fileExists('BruteSSH.exe')){ ports++; } 
    if(ns.fileExists('FTPCrack.exe')){ ports++; } 
    if(ns.fileExists('HTTPWorm.exe')){ ports++; } 
    if(ns.fileExists('relaySMTP.exe')){ ports++; }
    if(ns.fileExists('SQLInject.exe')){ ports++; } 
    return ports; 
}


/** @param {NS} ns **/
export async function main(ns) {

}
