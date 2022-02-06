/**
 * security.js - Information about permissions
 * ==============================================
 */

import * as resource from './bin/resource';

/**
 * Check if we are able to hack a given server
 *  
 * @param {*} ns 
 * @param {*} server 
 * @returns 
 */
export function canHack(ns, server){

    let security = {};

    security.server                 = server;
    security.hackingLevel           = ns.getHackingLevel();
    security.serverHackingLevel     = ns.getServerRequiredHackingLevel(server);
    security.serverPortsRequired    = ns.getServerNumPortsRequired(server);
    security.portsOpen              = resource.getNumberOfPortsAvailableToOpen(ns);
    security.rootAccess             = ns.hasRootAccess(server);

    if( security.hackingLevel > security.serverHackingLevel && 
        security.serverPortsRequired <= security.portsOpen &&
        security.rootAccess){
        return true;
    } 

    return false;
}

/** @param {NS} ns **/
export async function main(ns) {
}
