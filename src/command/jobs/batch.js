import * as app from './src/app/interface';
import * as icons from './src/app/iconInterface';
import * as worker from './src/command/jobs/worker';
import * as threads from './src/command/jobs/threads';
import * as job from './src/command/jobs/job';
import * as status from './src/command/servers/status';

/**
 * Set data for batch job: 
 * - Max processes
 * - Min ram 
 * - Max ram
 * - Icon
 * - Total running processes for a job
 * 
 * @param {*} ns 
 * @param {*} job 
 * @param {*} jobs 
 * @param {*} servers 
 * @returns 
 */
export function setParams(ns, job, jobs, servers){

    let totalRunningProcessesFor = status.scripts(ns, servers, job.target);        
    let totalRamAcrossNetwork = status.getRamAvailableAcrossNetwork(ns, servers, job.target);
    let totalRamUsedAcrossNetwork = status.getUsedRamAcrossNetwork(ns, servers, job.target);
    let maxProcesses, minRam, maxRam;
    let icon = icons.get(job.strategyName.toLowerCase());

    //console.log(totalRamAcrossNetwork,totalRamUsedAcrossNetwork);
    //console.log(jobs);

    // TODO: Create a sliding scale of available ram based on the
    //       hack job length and the grow job length

    let growPercent = jobs.grow.length/jobs.hack.length;
    let hackPercent = 1;
    let growRam, hackRam; 
    
    // console.log(growPercent);
    
    if(growPercent > 0){
        growPercent = 1 - growPercent;
    }

    growRam = totalRamAcrossNetwork * growPercent;
    hackRam = totalRamAcrossNetwork * hackPercent;

    if(hackPercent === 1){
        growRam = 0;
        hackRam = totalRamAcrossNetwork;
    }

    // console.log(growPercent, hackPercent, growRam, hackRam);

    switch(job.strategyName){
        case 'Hack':         
            maxProcesses = Math.round(job.threadsHack * 4);
            minRam = app.getHackRamLimit(); 
            maxRam = 1024;
            break;
        case 'Grow':
            maxProcesses = Math.round(job.threadsGrow * 2);
            minRam = app.getGrowRamLimit(); 
            maxRam = 1024;
            break;
        case 'Weaken':
            maxProcesses = Math.round(job.threadsWeaken);
            minRam = app.getWeakenRamLimit(); 
            maxRam = 1024;
            break;
    }

    // console.log(minRam, maxRam, maxProcesses);

    // LOG: Show ram being allocated to each batch
    
    return {maxProcesses, minRam, maxRam}
}

/**
 * Execute batch on workers
 * 
 * @param {*} ns 
 * @param {*} jobs 
 * @param {*} workerServers 
 * @param {*} workerServers 
 * @returns 
 */
export async function execute(ns, jobs, allJobs, workerServers){
    
    for(let i in jobs){       

        let currentJob = jobs[i]; 
        let { 
            maxProcesses, 
            minRam, 
            maxRam, 
        } = setParams(ns, currentJob, allJobs, workerServers);        
        
        if( threads.getTotalThreads(ns, currentJob) <= maxProcesses * 2){
            
            let foundWorker = await worker.getWorker(ns, workerServers, currentJob, minRam, maxRam);
            if (foundWorker != ''){      
                if(job.execute(ns, foundWorker, currentJob) > 0){                    
                    jobs.splice(i, 1);             
                    i--; 

                    ns.print(
                        icons.get('target') + ' '
                        + currentJob.target 
                        + ' '
                        + icons.get('worker') + ' '
                        + foundWorker
                        + ' '
                        + '(' 
                        + threads.getTotalThreads(ns, currentJob)
                        + '/' 
                        + maxProcesses
                        + ')'
                        );

                    await ns.sleep(app.getDebugDelay());            
                }
            } 
        } 
    }

    return true;

}

/**
 * 
 * @param {NS} ns 
 */
export async function main(ns){
    
}