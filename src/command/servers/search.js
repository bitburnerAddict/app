/**
 * search.js - Search for servers
 * ==============================================
 * Recursively search for servers (nodes) on
 * the home network 
 * 
 * 
 */

/**
 * Search for child nodes 
 * 
 * @param {*} array 
 * @param {*} ns 
 * @returns 
 * @deprecated 
 */
export function search(array, ns) {	

	let unique = [], 
		uniqueNodes = [];

	// Loop through servers and scan for child nodes
	for (let i = 0; i < array.length; i++) {

		// scan server
		let childNodes = ns.scan(array[i]);

		// Check for duplicates
		unique = childNodes.filter(function(obj) { 
			return array.indexOf(obj) == -1;
		});

		// Remove 'home' node
		unique.shift();		

		// Push results to return array	
		if(unique.length > 0){
			unique.forEach((node) => {				
				uniqueNodes.push(node);
			});			
		}

	}

	// Return unique child nodes
	return uniqueNodes;

}

/**
 * 
 * @param {*} ns 
 * @param {*} server 
 * @param {*} all 
 * @returns 
 */
export function addChildNodes(ns, server, all){

	let nodes = ns.scan(server);
	let childNodes = [];

	if(!all.includes(server)){
		childNodes.push(server);			
	}

	nodes.forEach(childNode => {
		if(!all.includes(childNode)){
			childNodes.push(childNode);	
		}
	});

	return childNodes;

}

/**
 * 
 * @param {NS} ns 
 * @returns 
 */
export function main(ns) {

	ns.disableLog('ALL');
	
	let x 					= 1,
		depth 				= 30,
		all					= [],
		servers 			= ns.scan('home');

	servers.forEach(element => {
		addChildNodes(ns, element, all).forEach(node => {
			all.push(node);
		});		
	});

	while ( x < depth){

		servers = all;
		servers.forEach(element => {
			addChildNodes(ns, element, all).forEach(node => {
				all.push(node);
			});		
		});
	
		x++;

	}
	
	all = all.filter(element => element !== 'home');

	// Return all servers
	return all;

}