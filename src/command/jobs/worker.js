import * as app from './src/app/interface';

/**
 * Get worker for batch job
 * 
 * @param {*} ns 
 * @param {*} servers 
 * @returns foundServer.hostname
 */
 export async function getWorker(ns, servers, job, minRam, maxRam){

    let serverFound = false;
    let server;

    while(serverFound === false){
        servers.find(node => {

            let remainingRam, remainder;
            let serverMaxRam = ns.getServerMaxRam(node);
            let serverRamUsed = ns.getServerUsedRam(node);

            if(serverMaxRam > 0 && serverRamUsed < serverMaxRam){ 

                remainingRam = Math.round(serverMaxRam - serverRamUsed);       
                remainder = remainingRam % 2; // remaining ram is a multiple of 2

                if(job.strategyName === 'Hack'){
                    remainder = remainingRam % app.getHackRamLimit(); // remaining ram is a multiple of 4
                }

                if(remainingRam >= serverMaxRam * 0.25 // server has 25% ram 
                    && remainingRam >= minRam // remaining ram in min/max constraints
                    && remainingRam <= maxRam // remaining ram in min/max constraints
                    && (remainder === 0) // multiple of 2 or 4
                    ){ 
                    serverFound = true;
                    server = node;
                    return true;
                }

                return false;
            }                     
            
        });
        await ns.sleep(20);
    }

    // Return the found server name 
    return server;

}

/**
 * 
 * @param {NS} ns 
 */
export async function main(ns){
    
}
