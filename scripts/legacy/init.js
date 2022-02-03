/**
 * Script functions 
 * ================================================================
 */

// Run script on remove server
async function runScript(serverArray, ns){		
	let server 	= serverArray[0],
		script 	= 'early-hack-template.script',
		threads = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam(script));
	
	try {
		await ns.scp(script, server);
		await installBruteSHH(ns);
		await ns.brutessh(server);
		await installFTPCrack(ns);
		await ns.ftpcrack(server);
		await ns.nuke(server);
		await ns.exec(script, server, threads);
		await ns.tprint('successfully hacked ' + server + ' using ' + threads + ' threads');
		await ns.tprint('Available money on ' + server + ': $' + ns.getServerMoneyAvailable(server));
	} catch(err) {
		await ns.tprint('failed to hack '+ server);
		console.log('Server error: '+ server);
		console.log(err);
	}
}

// Wait for BruteSSH.exe to be install
// This will be required when Augmentations are ready
async function installBruteSHH(ns) {
	while (!ns.fileExists("BruteSSH.exe")) {
		ns.sleep(60000);
	}	
}

// Wait for FTPCrack.exe to be install
// This will be required when Augmentations are ready
async function installFTPCrack(ns) {
	while (!ns.fileExists("FTPCrack.exe")) {
		ns.sleep(60000);
	}	
}

// Output server details to console (view in Debug)
function output(server, ns){
	console.log('Server: ' + server[0] + ', Threads: ' +  Math.floor(ns.getServerMaxRam(server[0]) / ns.getScriptRam('early-hack-template.script')));
}

/**
 * Main runtime function
 * ================================================================
 */

/** @param {NS} ns **/
export async function main(ns) {

	let servers = [
		['n00dles', [
			['nectar-net',[
				['neo-net'],
				['silver-helix']
			]],
			['CSEC'], [
				['phantasy']
			]
		]],
		['foodnstuff', [
			['zer0',[
				['omega-net']
			]],
			['max-hardware']
		]],
		['joesguns'],
		['hong-fang-tea'],
		['harakiri-sushi'],
		['sigma-cosmetics'],
		['foodnstuff']
	]

    for (let i = 0; i < servers.length; i++) {

		// Define servers
		let server = servers[i], 
			child = [],
			grandChild = [];

		// Process server
		output(server, ns);
		await runScript(server, ns);

		// Process child server		
		if(server[1]){
			for (let x = 0; x < server[1].length; x++) {
				child = server[1][x];
				output(child, ns);
				await runScript(child, ns);

				// Process grandchild server
				if(child[1]){
					for (let x = 0; x < child[1].length; x++) {
						grandChild = child[1][x];
						output(grandChild, ns);
						await runScript(grandChild, ns);
					};
				}

			};
		}
		
    };

}