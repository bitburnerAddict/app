/**
 * search.js - Search for servers
 * ==============================================
 * Recursively search for servers (nodes) on
 * the home network 
 *  
 */

export async function search(array, ns) {	

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

/** @param {NS} ns **/
export async function main(ns) {

	let x 					= 1,
		depth 				= 20,
		nodesArr			= [],
		all					= [],
		servers 			= ns.scan('home');

	nodesArr['nodes_0'] 	= servers;	
	nodesArr['nodes_1'] 	= await search(servers, ns);

	// Search child nodes to given depth
	while( x < depth ) {
		let prev = x - 1;
		nodesArr['nodes_'+x] = await search(nodesArr['nodes_' + prev], ns);
		all = all.concat(nodesArr['nodes_0'], await search(nodesArr['nodes_' + prev], ns), all);
		x++;
	}

	// Filter out duplicates that have slipped through
	all = all.filter(function (value, index, array) { 
		return array.indexOf(value) === index;
	});	

	// Return all servers
	return all;

}