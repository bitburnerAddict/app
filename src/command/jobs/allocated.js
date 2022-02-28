import * as app from './src/app/interface';
import * as status from './src/command/servers/status';

 

/**
 * Check to see if all hack jobs have been allocated
 * 
 * @param {*} ns 
 * @param {*} hackJobs 
 * @param {*} servers 
 * @returns 
 */
export function hack(ns, hackJobs, servers){

    let hackAllocated = false;
    for(let i in hackJobs){
        let processesForTarget = status.scripts(ns, servers, hackJobs[i].target);
        if( processesForTarget >= app.getHackProcessLimit() ){ 
            hackAllocated = true; 
        } else {
            hackAllocated = false;
        }
    }
    return hackAllocated;

}

/**
 * Check to see if all grow jobs have been allocated
 * 
 * @param {*} ns 
 * @param {*} growJobs 
 * @param {*} servers 
 * @returns 
 */

export function grow(ns, growJobs, servers){

    let growAllocated = false;
    for(let i in growJobs){
        let processesForTarget = status.scripts(ns, servers, growJobs[i].target);
        if( processesForTarget >= app.getHackProcessLimit() ){ 
            growAllocated = true; 
        } else {
            growAllocated = false;
        }
    }
    return growAllocated;

}

/**
 * 
 * @param {NS} ns 
 */
export async function main(ns){
    
}
