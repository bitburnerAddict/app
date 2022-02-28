import * as app from './src/app/interface';
import * as delay from './src/command/jobs/delay';
import * as threads from './src/command/jobs/threads';
import * as icons from './src/app/iconInterface';

/**
 * Execute jobs on worker
 * 
 * @param {*} ns 
 * @param {*} node 
 * @returns  
 */
 export function execute(ns, worker, job){

    let t = threads.get(ns, worker, job);

    let totalThreads = t.gThreads + t.gWThreads + t.hThreads + t.hWThreads;
    let availableRam = Math.round((ns.getServerMaxRam(worker) - ns.getServerUsedRam(worker)));
    let availableThreads = availableRam/2;

    //console.log('Calculated threads: ', t);
    //console.log('Total threads for job: ', totalThreads);
    //console.log('Available threads: ', availableThreads);

    if(totalThreads <= availableThreads && totalThreads > 0){ // safe guard to check for threads at the last mintue.

        for(let s in job.strategy){
            
            let pid =  job.target + '_' + Date.now();

            let jobThreads;
            switch(job.strategy[s]){ 
                case 'h': 
                    //jobThreads = job.strategyThreads.h;
                    jobThreads = t.hThreads;
                    break;
                case 'hW':
                    //jobThreads = job.strategyThreads.hW;
                    jobThreads = t.hWThreads;
                    break;
                case 'g':
                    //jobThreads = job.strategyThreads.g;
                    jobThreads = t.gThreads;
                    break;                    
                case 'gW':
                    //jobThreads = job.strategyThreads.gW;
                    jobThreads = t.gWThreads;
                    break;
                case 'w':
                    //jobThreads = job.strategyThreads.w;
                    jobThreads = t.wThreads;
                    break;  
            }

            let exec = ns.exec( 
                app.getDeployScript(), 
                worker,
                jobThreads,
                job.strategy[s],
                job.target,
                delay.get(job.strategy[s], job),
                pid);  
                
            if(exec === 0){
                return false;
            } else {
                ns.print(icons.get('info') + ' INFO: ' +job.strategy[s]+ ' complete using ' + jobThreads + ' threads');
                // console.log('Job successfully run: ', job.strategy[s], jobThreads, job.target);
                // LOG: Output each strategy part being run. 
            }

        }
    }

    ns.print(icons.get('info') + ' INFO: Batch complete.');
    // LOG: Out batch has completed running. 
    return true;

}

/**
 * 
 * @param {NS} ns 
 */
export async function main(ns){
    
}
