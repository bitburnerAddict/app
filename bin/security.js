/**
 * security.js - Information about permissions
 * ==============================================
 */

/**
 * Check if we are able to hack a given server
 *  
 * @param {*} ns 
 * @param {*} server 
 * @returns 
 */
export async function canHack(ns, server){
    let player  = ns.getPlayer();
    if( player.hacking > server.requiredHackingSkill && 
        server.numOpenPortsRequired <= server.openPortCount &&
        server.hasAdminRights){
        return true;
    } 
    return false;
}

/** @param {NS} ns **/
export async function main(ns) {
}
