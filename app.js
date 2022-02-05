/**
 * app.js - Main Application
 * ==============================================
 * Choose from the following options:
 * 1. report
 * 2. hack
 * 3. stop
 * 4. start
 * 5. create
 * 6. purchase
 * 
 * TODO's
 * ======
 * 
 * 1. Have specific options for early game
 *    a. Notes of hacking level required (50?)
 * 	  b. Notes to buy TOR Router
 *    c. Increase hacking level reminder
 * 
 * 2. Write filemanager.js - for adding and removing remote files
 * 3. Once filemanger.js is complete, write function to 
 * 	  a. kill scripts
 *    b. remove script
 *    c. add new script
 *    d. run new script
 * 
 * 4. Create a function for running script locally to use 
 *    all local resources to attack a server
 * 5. Reminder how to increase local processing power - MAX OUT 
 *  
 */

// Imports
import * as report from './bin/report';
import * as hack from './bin/hack'
import * as pm from './bin/pm';
import * as generator from './bin/generator';
import * as servers from './bin/servers';

/** @param {NS} ns **/
export async function main(ns) {
	
	switch(ns.args[0]){
		case "report":
			await report.main(ns);
			break;
		case "hack":
			await hack.gainAccess(ns);
			break;
		case "stop":
			await pm.stop(ns);
			break;	
		case "start":
			await pm.start(ns);
			break;
		case "create":
			await generator.hackScript(ns, 'n00dles');
			break;			
		case "purchase":			
			await servers.purchaseServers(ns);
			break;
		default:
			console.log('Default');
			break;
	}
	
}