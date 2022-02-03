/**
 * Run main hacking routine
 * ==============================================
 * Attempt to gain access to a server and run the
 * main early-hack-template.script.
 * 
 * The script will attempt to open ports using
 * the following programs (if available):
 * 
 * 1. BruteSSH.exe (port 22)
 * 2. FTPCrack.exe (port 21)
 * 3. HTTPWorm.exe (port 80)
 * 4. relaySMTP.exe (port 25)
 * 5. SQLInject.exe (port 3306)
 * 
 */

import * as hackInterface from '/bin/hackInterface.js';
import * as messages from '/bin/messages.js';

export async function run(server, ns) {

    let script 			= hackInterface.getServerPattern(),
        serverRam 		= ns.getServerMaxRam(server),
        scriptRam 		= ns.getScriptRam(script),
        requiredPorts 	= ns.getServerNumPortsRequired(server),		
        isScriptRunning = ns.scriptRunning(script,server),
        threads 		= Math.floor(serverRam / scriptRam),
        ports 			= 0,
        debug 			= false;

    console.log('Hacking: ' + server);

    if (debug) {
        console.log(ns.getServer(server));		
        console.log('Script RAM: ' + scriptRam);
        console.log('Server RAM: ' + serverRam);
        console.log('Threads: ' + threads);
        console.log('Script Running: ' + isScriptRunning);
        return true;
    }

    if ( !ns.scriptRunning(script,server) ) {

        try {

            if(server === null){
                throw('Server is not defined.');
            }

            if(threads < 1) {
                throw('No threads available (server RAM: '+serverRam+ ', script RAM: ' +scriptRam+ ')');
            }

            await ns.scp(script, server);

            if(ns.fileExists('BruteSSH.exe')){
                await ns.brutessh(server);
                ports++;
            } 

            if(ns.fileExists('FTPCrack.exe')){
                await ns.ftpcrack(server);
                ports++;
            } 

            if(ns.fileExists('HTTPWorm.exe')){
                await ns.httpworm(server);
                ports++;
            }

            if(ns.fileExists('relaySMTP.exe')){
                await ns.relaysmtp(server);
                ports++;
            } 

            if(ns.fileExists('SQLInject.exe')){
                await ns.sqlinject(server);
                ports++;
            }

            if(ns.fileExists('NUKE.exe') && ports >= requiredPorts){
                await ns.nuke(server);
            } else {
                throw('Failed to NUKE.exe (ports: ' + ports + '/' + requiredPorts + ')');
            }

            await ns.exec(script, server, threads);
            await ns.tprint('Successfully hacked ' + server + ' using ' + threads + ' threads');
            messages.availableMoney(ns, server);

        } catch(err) {
            await ns.tprint('ERROR: Failed to hack '+ server);
            console.log(err);
        }
        
    } else {
        messages.alreadyRunning(ns, server);
    }

}
 
 
/** @param {NS} ns **/
export async function main(ns) {

}