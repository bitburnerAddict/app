/**
 * app.js - Main Application
 * ==============================================
 * Initialise the app by hacking all servers
 * on the network, and purchased servers. 
 * 
 * Follow up by attempting to purchase as many 
 * servers as possible
 * 
 * 
 * TODO's
 * ======
 * 
 * 1. Write script to connect to darkweb and purchase programs
 * 2. Write script to check factions 
 * 3. Add hacking level checks to scripts with output
 * 4. Look at making the hacking script dynamic so that you 
 *    can target multiple servers at the same time
 * 
 *    For this, use the 'write' function, consider loading
 *    a template file and combining it with the dynamic
 *    server name
 * 
 * 5. Write script to monitor money on servers, is it going 
 *    down? What happens if you hack different servers?
 * 6. Make sure all the messages are in messages.js
 *  
 */

// Imports
import * as servers from '/bin/servers.js';

/** @param {NS} ns **/
export async function main(ns) {
	
	//await servers.getTargetServer(ns);
	await servers.hackServers(ns);
	await servers.purchaseServers(ns);

	let bestEfficency = await servers.getEfficency(ns, 'The-Cave', 0);
	console.log('The-Cave hack efficency: ' + bestEfficency[1]);
	console.log('The-Cave total money: ' + bestEfficency[2]);
	console.log('The-Cave total time: ' + bestEfficency[3]);

	let noodlesEfficency = await servers.getEfficency(ns, 'n00dles', 0);
	console.log('n00dles hack efficency: ' + noodlesEfficency[1]);
	console.log('n00dles total money: ' + noodlesEfficency[2]);
	console.log('n00dles total time: ' + noodlesEfficency[3]);
	
}