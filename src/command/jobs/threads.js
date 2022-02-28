import * as app from './src/app/interface';
import * as search from './src/command/servers/search';
import * as icons from './src/app/iconInterface';

/**
 * 
 * @param {*} ns 
 * @param {*} strategy 
 * @param {*} worker 
 * @returns 
 */
export function get(ns, worker, job){

    let availableRam = ns.getServerMaxRam(worker) - ns.getServerUsedRam(worker);
    let availableThreads = availableRam/2;
    let gThreads = 0, gWThreads = 0, hThreads = 0, hWThreads = 0;
    let ratios = app.getRatios();

    // console.log('Available ram: ',availableRam);
    // console.log('Available threads: ',availableThreads);
    // console.log('Threads to hack: ', job.threadsHack);
    // console.log('Max threads: ',app.getMaxThreads());
    // console.log('Current threads for hack: ', getTotalThreads(ns, job));
    // console.log(job);

    // if(availableThreads > app.getMaxThreads()){
    //     availableThreads = app.getMaxThreads();
    // }

    if(job.strategy.length === 4){
        ratios = app.getHackRatios();
        hThreads = Math.floor(availableThreads * ratios.h);
        hWThreads = Math.ceil(availableThreads * ratios.hW);
    } 

    gThreads =  Math.floor(availableThreads * ratios.g);
    gWThreads = Math.ceil(availableThreads * ratios.gW); 

    // LOG: Show threads being allocated to job
    ns.print(icons.get('info') + ' INFO: ' + (hThreads + hWThreads + gThreads + gWThreads) + ' threads prepared for allocation')

    return {gThreads, gWThreads, hThreads, hWThreads}

}

/**
 * Get total threads for a job
 * 
 * @param {*} ns 
 * @param {*} job 
 * @returns 
 */
export function getTotalThreads(ns, job) {

    let servers = search.main(ns);
    let processes = [];
    let threads = 0;

    servers.forEach(element => {
        if(ns.ps(element).length > 0){
            processes.push(ns.ps(element));
        }        
    });
    
    processes.forEach(element => {
        element.forEach(process => {
            if(process.args[1] === job.target){
                threads = threads + process.threads;
            }
        });
    });

    switch(job.strategyName){
        case 'Hack':
            threads = threads;    
            break;
        case 'Grow':
            threads = threads;
            break;
        case 'Weaken':
            break;
    }

    return threads;

}

/**
 * Get total required allocated threads for a job
 * 
 * @param {*} ns 
 * @param {*} jobs 
 * @returns 
 */
export function getRequiredThreadsForJobs(ns, jobs){
    let totalThreads = 0;
    let totalAllocated = 0;
    jobs.forEach(job => {        
        switch(job.strategyName){
            case 'Hack':
                totalThreads =  Math.round(totalThreads + (job.threadsHack * 4));
                totalAllocated =  Math.round(totalAllocated + getTotalThreads(ns, job));
                break;
            case 'Grow':
                totalThreads =  Math.round(totalThreads + (job.threadsHack * 2));
                totalAllocated = Math.round(totalAllocated + getTotalThreads(ns, job));
                break;
            case 'Weaken':
                totalThreads =  Math.round(totalThreads + job.threadsWeaken);
                totalAllocated =  Math.round(totalAllocated + getTotalThreads(ns, job));
                break;
        }
    });



    return {totalThreads, totalAllocated}
}

/**
 * 
 * @param {NS} ns 
 */
export async function main(ns){

}