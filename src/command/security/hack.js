import * as app from './src/app/interface';
import * as calc from './src/util/calc';
import * as report from './src/util/report';
import * as build from './src/command/jobs/build';
import * as batch from './src/command/jobs/batch';
import * as threads from './src/command/jobs/threads';
import * as icons from './src/app/iconInterface';

/**
 * hack.hs - Main hack script to weaken, grow and hack servers
 * 
 * @param {NS} ns 
 */

export async function main(ns, servers, strategy){   

    // Config  
    ns.disableLog('ALL');

    let hackableServers = servers.filter(node => calc.canHack(ns, node));

    let workerHackServers = servers.filter(node => calc.canWork(ns, node, 8));
    let workerGrowServers = servers.filter(node => calc.canWork(ns, node, 4));
    let workerWeakenServers = servers.filter(node => calc.canWork(ns, node, 2));

    while(true){

        let hackJobs = [], growJobs = [], weakenJobs = [];
        hackableServers = servers.filter(node => calc.canHack(ns, node));

        if(hackableServers.length > 0) {

            let {hackJobs, growJobs, weakenJobs, canNotWeakenServers} = await build.jobs(ns, hackableServers);
            let jobs = {
                hack: hackJobs,
                grow: growJobs,
                weaken: weakenJobs
            }

            if(strategy === 'report'){
                report.end(ns, jobs, canNotWeakenServers, servers, hackableServers);
            }

            if(strategy === 'hack'){
                
                await batch.execute(ns, jobs.hack, jobs, workerHackServers);

                let {totalThreads, totalAllocated} = threads.getRequiredThreadsForJobs(ns, jobs.hack);

                if(totalAllocated >= totalThreads){  
                    if(jobs.hack.length > 0){ 
                        jobs.hack.forEach(job => {
                            ns.print(icons.get('success') +  ' INFO: Threads allocated for ' + job.target + ' ('+ threads.getTotalThreads(ns, job) +'/'+ Math.round(job.threadsHack * 4) +')');
                        });
                        ns.print(icons.get('success') + ' SUCCESS: All threads allocated');
                        report.end(ns, jobs, canNotWeakenServers, servers, hackableServers);
                    } 
                }

            }

            if(strategy === 'grow'){
                await batch.execute(ns, jobs.grow, jobs, workerGrowServers);                      

                let {totalThreads, totalAllocated} = threads.getRequiredThreadsForJobs(ns, jobs.hack);

                if(totalAllocated >= totalThreads){  
                    if(jobs.grow.length > 0){ 
                        jobs.grow.forEach(job => {
                            ns.print(icons.get('info') + ' INFO: Threads allocated for ' + job.target + ' ('+ threads.getTotalThreads(ns, job) +'/'+ Math.round(job.threadsGrow * 2) +')');
                        });
                        ns.print(icons.get('success') + ' SUCCESS: All threads allocated');
                        report.end(ns, jobs, canNotWeakenServers, servers, hackableServers);
                    } 
                } 

            }

            // if(strategy === 'weaken'){
            //     await batch.execute(ns, weakenJobs, jobs, workerWeakenServers, hackableServers);
            // }
         

            
        } else {
            if(strategy === 'report'){
                report.end(ns, hackJobs, growJobs, weakenJobs, workerServers, servers);
            }
        } 

        

        await ns.sleep(app.getDeployDelay()); 
    }

} 

