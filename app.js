/**
 * app.js - Main Application
 * ==============================================
 * Hack all servers on the network (early game)
 * 
 * Usage: 
 * run app.js <report|hack|stop|start|generate|purchase|clean|upload> <late>
 * 
 * Options: 
 * hack 	- gain root, upload script and start
 * stop 	- stop all scripts on network
 * start 	- start all scrits on network
 * generate - generate hack script with most efficienct server injected
 * puchase  - purchase empty servers to run scripts on
 * clean	- kill script across the network
 * upload	- upload script across the network
 * 
 * Notes: 
 * - Adding "late" as a second argument runs the late game hacking script
 *   that targets the most efficient server
 * 
 */

// Imports
import * as appInterface from './bin/appInterface';
import * as filemanager from './bin/filemanager';
import * as generator from './bin/generator';
import * as hack from './bin/hack'
import * as messages from './bin/messages';
import * as pm from './bin/pm';
import * as report from './bin/report';
import * as resource from './bin/resource';
import * as search from './bin/search';
import * as servers from './bin/servers';

/** @param {NS} ns **/
export async function main(ns) {
	
	let script			= appInterface.getEarlyHackingScript();
	let allServers 		= await search.main(ns);
	let target 			= await servers.getTarget(ns, allServers);
	let reservedThreads = 20;

	// Pass "late" for late game script that finds the best
	// server to hack, where as the early game script uses
	// the template provided in the documentation
	switch(ns.args[1]){
		case "late":
			script = appInterface.getDynamicScript();
			await generator.hackScript(ns, target);
			break;
	}	

	switch(ns.args[0]){

		// Report on player info
		case "report":
			await report.main(ns, allServers);
			await report.serverInfo(ns, allServers);
			await report.scriptInfo(ns, allServers);
			break;

		// Nuke all of the available servers
		case "nuke":
			await hack.nuke(ns, allServers);
			break;	
		
		// Hack all of the available servers
		case "hack":
			await hack.nuke(ns, allServers);
			await filemanager.clean(ns, script, allServers);
			await filemanager.upload(ns, script, allServers);
			await pm.start(ns, script, allServers);		
			if( resource.calculateThreads(ns, 'home', script) > 0 ){
				await ns.run(script, resource.calculateThreads(ns, 'home', script));
			}
			break;

		// Run persistent loop every 5 minutes that tries to hack new servers
		case "persist":
			while(true){
				let newTarget = await servers.getTarget(ns, allServers);
				await servers.purchaseServers(ns, script);
				await hack.nuke(ns, allServers);
				if(newTarget !== target){
					await generator.hackScript(ns, newTarget);
					await filemanager.clean(ns, script, allServers);
					await filemanager.upload(ns, script, allServers);
				}
				await pm.start(ns, script, allServers);
				if( resource.calculateThreads(ns, 'home', script) > 0 ){
					await ns.run(script, resource.calculateThreads(ns, 'home', script) - reservedThreads);
				}
				await ns.sleep(300000);
			}	

		// Distrubuted attack on one server
		case "distributed":
			await hack.distributed(ns);
			break;	

		// Stop all of the scripts on all servesr
		case "stop":
			await pm.stop(ns, allServers);
			break;	

		// Start all of the scripts on all servers
		case "start":
			await pm.start(ns, script, allServers);
			await ns.run(script, resource.calculateThreads(ns, 'home', script) - reservedThreads);
			break;

		// Generate hack.script file with most efficient server
		case "generate":
			await generator.hackScript(ns, await servers.getTarget(ns, allServers));
			break;			
		
		// Purchase as many servers as possible and run script on them
		case "purchase":			
			await servers.purchaseServers(ns, script);
			break;
		
		// Remove purchased servers
		case "remove-servers":
			await servers.remove(ns);
			break;

		// Remove script from all servers
		case "clean":
			await filemanager.clean(ns, script, allServers);
			break;

		// Upload script to all servers
		case "upload":
			await filemanager.upload(ns, script, allServers);
			await filemanager.upload(ns, appInterface.getHackScript(), allServers);
			await filemanager.upload(ns, appInterface.getGrowScript(), allServers);
			await filemanager.upload(ns, appInterface.getWeakenScript(), allServers);
			await filemanager.upload(ns, '/scripts/hacks/weaken-second.js', allServers);
			break;
		
		default:
			messages.log(ns, 'No options selected. Example: run app.js <report|hack|stop|start|generate|purchase|clean|upload> <late>');
			break;
	}
	
}