import * as app from './src/app/interface';
import * as status from './src/command/servers/status';

/**
 * 
 * @param {*} ns 
 * @param {*} hackJobs 
 * @param {*} growJobs  
 * @param {*} weakenJobs 
 * @param {*} servers 
 */
export function end(ns, jobs, canNotWeakenServers, servers, hackableServers){
    ns.print('--------------------------------------------------------------');
    ns.print('➡️ INFO: 💵(' + jobs.hack.length + ') 🌱(' + jobs.grow.length + ') ' + '🔓(' + jobs.weaken.length + ')' + ' 🔒(' + canNotWeakenServers.length + ')');
    ns.print('➡️ INFO: Total running proccesses (' + status.totalRunning(ns, servers) + ')');
    ns.print('➡️ INFO: Total servers (' + servers.length + ')');
    ns.print('➡️ INFO: Total hackable servers (' + hackableServers.length + ')');
    ns.print('➡️ INFO: Most profitable server ' + mostProfitableServer(ns, hackableServers));
    ns.print('--------------------------------------------------------------');
    
    //console.log(hackJobs);
    //console.log(growJobs);

}

export function mostProfitableServer(ns, servers){

    servers.forEach(element => {
        
    });

}

/**
 * 
 * @param {NS} ns 
 */
 export async function main(ns){   
}

//ns.print('📈 INFO: Money level on ' + job.target + ' ' + ns.nFormat(job.money, '$0,0.00') + '/' + ns.nFormat(job.moneyThresh, '$0,0.00') );
