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
export async function getAvailableServerRam(ns, server) {
    server = ns.getServer(server);
    let availableServerRam = (server.maxRam - server.ramUsed);
    return availableServerRam;
}

/**
 * Calculate threads
 * 
 * @param {NS} ns 
 */
export async function calculateThreads(ns, server, script) {
    return Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam(script));
}


/** @param {NS} ns **/
export async function main(ns) {

}
