import * as app from './src/app/interface';
import * as payloadModel from './src/command/servers/payload';
import * as threads from './src/command/jobs/threads';

export function calculateStrategyThreads(ns, payload){
    
    let h,g,hW,gW;

    if(payload.strategyName === 'Hack'){
        h = Math.round(payload.threadsTotal * 0.25);
        g = Math.round(payload.threadsTotal * 0.25);
        hW = Math.round(payload.threadsTotal * 0.25);
        gW = Math.round(payload.threadsTotal * 0.25);
        return {h,g,hW,gW}
    }

    if(payload.strategyName === 'Grow'){
        g = Math.round(payload.threadsTotal * 0.40);
        gW = Math.round(payload.threadsTotal * 0.60);
        return {g,gW}
    }

    if(payload.strategyName === 'Weaken'){
        w = Math.round(payload.threadsTotal * 0.25);
        return {w}
    }

}


/**
 * Build jobs for hacked servers
 * 
 * @param {*} ns 
 * @param {*} worker 
 * @param {*} jobs 
 */
export async function jobs(ns, servers) {

    let growJobs = [];
    let hackJobs = [];
    let weakenJobs = []; 
    let canNotWeakenServers = []; 

    servers.sort(function (a, b) { 
        return ns.getServerMaxRam(b) - ns.getServerMaxRam(a);
    });

    // Build the payloads for each server
    for(let i in servers){

        let target = servers[i];
        let payload = await payloadModel.build(ns, target);
        
        if ( payload.weakenTime < app.getWeakenTimeLimit()) {

            if( payload.security > payload.securityThresh ){
                payload.strategy = ['w'];
                payload.strategyName = 'Weaken';
                payload.strategyThreads = calculateStrategyThreads(ns, payload);
                weakenJobs.push(payload);
            } else if( payload.money < payload.moneyThresh ) {
                payload.strategy = ['g', 'gW'];
                payload.strategyName = 'Grow';
                payload.strategyThreads = calculateStrategyThreads(ns, payload);
                growJobs.push(payload);
            } else if( payload.money > 0 ){
                payload.strategy = ['h', 'hW', 'g', 'gW'];
                payload.strategyName = 'Hack';
                payload.strategyThreads = calculateStrategyThreads(ns, payload);
                hackJobs.push(payload);
            } 
        } else {
            canNotWeakenServers.push(payload);
        }

    }


    hackJobs.sort(function (a, b) { 
        return a.threadsHack - b.threadsHack;
    });

    growJobs.sort(function (a, b) {
        return a.threadsGrow - b.threadsGrow;
    }); 

    weakenJobs.sort(function (a, b) { 
        return a.weakenTime - b.weakenTime; 
    });  
    
    return {hackJobs, growJobs, weakenJobs, canNotWeakenServers}   
}

/**
 * 
 * @param {NS} ns 
 */
export async function main(ns){
    
}