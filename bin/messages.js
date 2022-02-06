/**
 * messages.js - Messages used in the app
 * ==============================================
 * Central place to keep all the messages
 * that are used throughout the application
 *  
 */

export function alreadyRunning(server) {
	return 'OK: Script is already running on ' + server;
}

export function notEnoughThreads(server) {
	return 'ERROR: Not enough threads to run script on ' + server;
}

export function noScriptFoundOnHost(server) {
	return 'ERROR: No script found on ' + server;
}

export function scriptNotRunning(server) {
	return 'ERROR: Script is not running on ' + server;
}

export function failedToNuke(ports, requiredPorts) {
	return	'ERROR: Failed to NUKE.exe (ports: ' + ports + '/' + requiredPorts + ')'
}

export function openedPorts(ports, server) {
	return 'OPENED: ' + ports + ' ports for ' + server;
}

export function scriptNowRunning(server) {
	return 'SUCCESS: Script is now running on ' + server;
}

export function successfullyHacked(server) {
	return 'SUCCESS: Hacked ' + server + '!';
}

export function removedScripts(script, server) {
	return 'SUCCESS: Stopped and removed ' + script + ' from ' + server;
}

export function uploadedScripts(script, server) {
	return 'SUCCESS: Uploaded and executed ' + script + ' on ' + server;
}

export function availableMoney( server) {
	return 'Available money on ' + server + ' is $' + ns.getServerMoneyAvailable(server);
}

export function log(ns, message){
	ns.tprint(message);
	//console.log(message);
	return message;
}

/** @param {NS} ns **/
export async function main(ns) {
}