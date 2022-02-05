/**
 * messages.js - Messages used in the app
 * ==============================================
 * Central place to keep all the messages
 * that are used throughout the application
 *  
 */

export async function alreadyRunning(ns, server) {
	ns.tprint('Script already running on ' + server);
}

export async function successfullyHacked(ns, server) {
	ns.tprint('Successfully hacked ' + server + '!');
}

export async function availableMoney(ns, server) {
	ns.tprint('Available money on ' + server + ' is $' + ns.getServerMoneyAvailable(server));
}

/** @param {NS} ns **/
export async function main(ns) {
}