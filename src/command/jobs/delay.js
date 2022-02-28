import * as app from './src/app/interface';

/**
 * Get delay timings for each task in a given strategy
 * 
 * @param {*} ns 
 * @param {*} job 
 * @param {*} worker 
 * @returns 
 */
export function get(strategy, job){

    let delay;

    switch(strategy){ 
        case 'h': 
            delay = job.timings.hackStart;                
            break;
        case 'hW':
            delay = job.timings.hackWeakenStart;
            break;
        case 'g':
            delay = job.timings.growStart;
            break;                    
        case 'gW':
            delay = job.timings.growWeakenStart;
            break;
        case 'w':
            delay = 0;
            break;  
    }

    return delay

}

/**
 * 
 * @param {NS} ns 
 */
export async function main(ns){

}