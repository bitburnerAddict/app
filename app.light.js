/**
 * app.light.js - Ligthweight Main Application
 * ==============================================
 * Hack all servers on the network (early game)
 * 
 * Usage: 
 * run app.light.js hack
 * 
 * Options: 
 * hack 	- gain root, upload script and start
 */

// Imports
import * as appInterface from './bin/appInterface';
import * as hack from './bin/hack'
import * as pm from './bin/pm';
import * as fileupload from './bin/fileupload';
import * as search from './bin/search';

/** @param {NS} ns **/
export async function main(ns) {	

	let allServers 	= await search.main(ns);

	switch(ns.args[0]){
		case "hack":
			await hack.nuke(ns, allServers);
            await fileupload.main(ns, appInterface.getEarlyHackingScript(), allServers);
            await pm.start(ns, appInterface.getEarlyHackingScript(), allServers);
			break;		
		default:
			console.log('run app.light.js hack');
			break;
	}	
}