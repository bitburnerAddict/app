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
	
	let script		= appInterface.getEarlyHackingScript();
	let allServers 	= await search.main(ns);
	let target 		= await servers.getTarget(ns, allServers);

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
		case "report":
			await report.main(ns, allServers);
			await report.serverInfo(ns, allServers);
			break;
		case "nuke":
			await hack.nuke(ns);
			break;			
		case "hack":
			await hack.nuke(ns);
			await filemanager.clean(ns, script);
			await filemanager.upload(ns, script);
			await pm.start(ns, script, allServers);
			await ns.run(script, resource.calculateThreads(ns, 'home', script));
			break;
		case "persist":
			while(true){			
				let newTarget = await servers.getTarget(ns, allServers);
				await servers.purchaseServers(ns, script);
				if(newTarget !== target){
					await generator.hackScript(ns, newTarget);
					await filemanager.clean(ns, script);
					await filemanager.upload(ns, script);
				}
				await pm.start(ns, script, allServers);
				await ns.run(script, resource.calculateThreads(ns, 'home', script));
				await ns.sleep(300000);
			}	
		case "distributed":
			await hack.distributed(ns);
			break;	
		case "stop":
			await pm.stop(ns);
			break;	
		case "start":
			await pm.start(ns, script, allServers);
			console.log(resource.calculateThreads(ns, 'home', script));
			await ns.run(script, resource.calculateThreads(ns, 'home', script));
			break;
		case "generate":
			await generator.hackScript(ns, await servers.getTarget(ns, allServers));
			break;			
		case "purchase":			
			await servers.purchaseServers(ns, script);
			break;
		case "remove-servers":
			await servers.remove(ns);
			break;
		case "clean":
			await filemanager.clean(ns, script);
			break;
		case "upload":
			await filemanager.upload(ns, script);
			break;
		default:
			messages.log(ns, 'No options selected. Example: run app.js <report|hack|stop|start|generate|purchase|clean|upload> <late>');
			break;
	}
	
}