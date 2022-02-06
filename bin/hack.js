/**
 * hack.js - Run main hacking routine
 * ==============================================
 * Attempt to gain access to a server and run the
 * main early-hack-template.script.
 * 
 */

import * as messages from './bin/messages.js';
import * as resource from './bin/resource';

/**
 * Attempt to gain access to servers on 
 * all available ports
 * 
 * @param {*} ns 
 */
export async function nuke(ns, servers){

    for( let i = 0; i < servers.length; i++ ) {

        let server = servers[i], 
            ports = resource.getNumberOfPortsAvailableToOpen(ns),
            requiredPorts = ns.getServerNumPortsRequired(server);

        if(ns.fileExists('BruteSSH.exe')){
            await ns.brutessh(server);
        } 
        if(ns.fileExists('FTPCrack.exe')){
            await ns.ftpcrack(server);
        } 
        if(ns.fileExists('HTTPWorm.exe')){
            await ns.httpworm(server);
        }
        if(ns.fileExists('relaySMTP.exe')){
            await ns.relaysmtp(server)           
        }
        if(ns.fileExists('SQLInject.exe')){
            await ns.sqlinject(server);
        }

        if(ns.fileExists('NUKE.exe') && requiredPorts <= ports ){
            await ns.nuke(server);
        } else {
            messages.log(ns, messages.failedToNuke(ports, requiredPorts));
        }
        
        messages.log(ns, messages.openedPorts(ports, server));

    }
}

export async function distributed(ns){
    
}

/** @param {NS} ns **/
export async function main(ns) {
}