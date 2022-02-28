import * as ports from './src/command/security/ports';
import * as inject from './src/command/security/inject';

/**
 * 
 * @param {NS} ns 
 */
export async function main(ns){   
    
}


/**
 * 
 * @param {*} ns 
 * @param {*} server 
 * @returns 
 */
 export function canWork(ns, server, ram){ 
     if(ns.getServerMaxRam(server) > ram){
         return true;
     }
 }

/**
 * 
 * @param {*} ns 
 * @param {*} server 
 * @returns 
 */
export function canHack(ns, server){ 

    if(ns.getServerMaxRam(server) > 0){
        let portsRequired = ns.getServerNumPortsRequired(server);
        let adminAcess = ns.hasRootAccess(server);
        let openPorts = ports.hack(ns, server, portsRequired, adminAcess);
        let canHack = true;

        if(!adminAcess){
            //console.log('🔒 ERROR: No root access to ' + server);
            canHack = false; 
        }

        if(openPorts < portsRequired){
            //console.log('🔒 ERROR: Not enough ports open ' + server + ' ('+openPorts+'/'+portsRequired+')');
            canHack = false;
        }

        if(ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel()){
            //console.log('🔒 ERROR: Hacking level not high enough for ' + server);   
            canHack = false;
        }

        if(ns.getServerMaxMoney(server) === 0){
            //console.log('🔒 ERROR: ' + server + ' can not hold money');   
            canHack = false;
        }

        if(canHack === true){
            //console.log('🔓 SUCCESS: Access granted to ' + server);   
            return true;
        }
    }

} 

/**
 * Get the start timings for a batch
 * 
 * @param {*} ns 
 * @param {*} host 
 * @returns 
 */
export function getTimings(ns, host){
    let offset = 1000;
    let hackWeakenStart = offset;
    let hackStart = (ns.getWeakenTime(host) - ns.getHackTime(host));
    let growWeakenStart = (offset * 3);
    let growStart = (ns.getWeakenTime(host) - ns.getGrowTime(host)) + (offset * 2);
    return {growWeakenStart, hackWeakenStart, growStart, hackStart}
}

/**
 * 
 * @param {*} host 
 * @param {*} growWeakenStart 
 * @param {*} hackWeakenStart 
 * @param {*} growStart 
 * @param {*} hackStart 
 * @returns 
 */
export function showEndTimings(ns, host, {growWeakenStart, hackWeakenStart, growStart, hackStart}){
    let a_first = hackStart + ns.getHackTime(host);
    let b_second = hackWeakenStart + ns.getWeakenTime(host);        
    let c_third = growStart + ns.getGrowTime(host);
    let d_fourth = growWeakenStart + ns.getWeakenTime(host);

    a_first = time.secondsToDhms(a_first / 1000) + ' - hack ends';
    b_second = time.secondsToDhms(b_second / 1000) + ' - hack weaken ends';
    c_third = time.secondsToDhms(c_third / 1000) + ' - grow ends ends';
    d_fourth = time.secondsToDhms(d_fourth / 1000) + ' - grow weaken ends';

    return {a_first, b_second, c_third, d_fourth}
}