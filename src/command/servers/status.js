import * as app from './src/app/interface';

/**
 * 
 * @param {NS} ns 
 */
export async function main(ns, servers){   

    let hack = [], 
        grow = [], 
        weaken = [],
        workers = [];    

    servers = await load(ns, servers);

    workers = servers.filter(node => {
        if(node.hasAdminRights){
            return true;
        }
        return false;
    });

    servers = servers.filter(node => {
        if(node.moneyAvailable > 0){
            return true;
        }
        return false;
    });

    for(let i in servers){ 

        let target = servers[i].hostname;
        let moneyThresh = ns.getServerMaxMoney(target) * app.getMoneyPercentLimit();
        let securityThresh = ns.getServerMinSecurityLevel(target) + app.getSecurityBuffer();
    
        servers[i].scriptCost = ns.getScriptRam(app.getDeployScript(), target);

        if (ns.getServerSecurityLevel(target) > securityThresh) {            
            weaken.push( servers[i] );
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            grow.push( servers[i] );
        } else {
            hack.push( servers[i] );
        } 

    }

    console.log('Hack Servers');
    console.log('-----------------------------');
    console.log(hack);

    console.log('Grow Servers');
    console.log('-----------------------------');
    console.log(grow);

    console.log('Weaken Servers');
    console.log('-----------------------------');
    console.log(weaken);

    console.log('Worker Servers');
    console.log('-----------------------------');
    console.log(workers);

    return {hack, grow, weaken}

}

/**
 * Load full server object (expensive)
 * 
 * @param {*} ns 
 * @param {*} servers 
 * @returns 
 */
export async function load(ns, servers){
    let data = [];
    for(let i in servers){
        data.push(ns.getServer(servers[i]));
    }
    return data;
}

/**
 * 
 * @param {*} ns 
 * @param {*} server 
 */
export function scripts(ns, servers, target){

    let processes = []; 

    for(let i in servers){
        
        let ps = ns.ps(servers[i]);

        if(ps.length > 0){
            for(let p in ps){
                ps[p].args.find(arg => {
                    if(arg === target){
                        processes.push(arg);
                        return true;
                    }
                });

            }
        } 
    }

    return processes.length;

}

/**
 * 
 * @param {*} ns 
 * @param {*} server 
 */
 export function totalRunning(ns, servers){

    let processes = 0; 

    for(let i in servers){    
        let ps = ns.ps(servers[i]);   
        processes = processes + ps.length;
    }

    return processes;

}

/**
 * 
 * @param {*} ns 
 * @param {*} servers 
 */
export function getRamAvailableAcrossNetwork(ns, servers){
    let ram = 0;
    for(let i in servers){
        let server = servers[i];
        ram = ns.getServerMaxRam(server) + ram; 
    }
    return ram;
}

/**
 * 
 * @param {*} ns 
 * @param {*} servers 
 */
 export function getUsedRamAcrossNetwork(ns, servers){
    let used = 0;
    for(let i in servers){
        let server = servers[i];
        used = ( ns.getServerMaxRam(server) - ns.getServerUsedRam(server) ) + used;
    }
    return used;
}

/**
 * 
 * @param {*} ns 
 * @param {*} servers 
 */
 export function getThreadsAvailableAcrossNetwork(ns, servers){
    let threads = getRamAvailableAcrossNetwork(ns, servers) / 2;
    return threads;
}