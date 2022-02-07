/**
 * 
 * @param {NS} ns 
 */
import * as search from './bin/search';
import * as serversModel from './bin/servers';
import * as resource from './bin/resource';
import * as appInterface from './bin/appInterface';
import * as pm from './bin/pm';
import * as time from './bin/time';

export async function main(ns){
    let analyze = {}
    let servers = await search.main(ns);    
    let dollarUSLocale = Intl.NumberFormat('en-US');

    let host = 'foodnstuff';
        //host = await serversModel.getTarget(ns, servers);

    analyze.server = host;

    analyze.times = {};
    analyze.times.weak = ns.getWeakenTime(host);
    analyze.times.grow = ns.getGrowTime(host);
    analyze.times.hack = ns.getHackTime(host);

    analyze.moneyFormatted = dollarUSLocale.format(ns.getServerMoneyAvailable(host));
    analyze.maxMoneyFormatted = dollarUSLocale.format(ns.getServerMaxMoney(host));

    analyze.money = ns.getServerMoneyAvailable(host);
    analyze.maxMoney = ns.getServerMaxMoney(host);
        
    analyze.security = ns.getServerSecurityLevel(host);
    analyze.securityMinLvl = ns.getServerMinSecurityLevel(host);

    analyze.increase = {};
    analyze.increase.security = ns.hackAnalyzeSecurity(1);
    analyze.increase.growth = ns.growthAnalyze(host, 2); // Calculate threads needed to grow x2

    analyze.decrease = {};
    analyze.decrease.weaken = ns.weakenAnalyze(1);

    analyze.threads = {};
    analyze.threads.million = ns.hackAnalyzeThreads(host, 1000000);
    analyze.threads.onepercent = ns.hackAnalyzeThreads(host, (analyze.money/100) * 1 );
    analyze.threads.half = ns.hackAnalyzeThreads(host, analyze.money/2);
    analyze.threads.all = ns.hackAnalyzeThreads(host, analyze.money);
    
    analyze.threads.requiredToWeaken = analyze.security / analyze.decrease.weaken; // Calculate threads needed to 100% weaken server

    analyze.moneyPerThread = analyze.money/100 * ns.hackAnalyze(host);
    analyze.chance = ns.hackAnalyzeChance(host);

    // Get the total number of threads available across the network
    let threads = 0, collection = [];
    servers.forEach((server) => {
        threads = threads + resource.calculatePotentialThreads(ns, server, appInterface.getWeakenScript());
        let node = {};
        node.server = server;
        node.threads = resource.calculatePotentialThreads(ns, server, appInterface.getWeakenScript());
        node.threadsAvailable = resource.calculateThreads(ns, server, appInterface.getWeakenScript());
        node.security = ns.getServerSecurityLevel(server);
        node.securityMinLvl = ns.getServerMinSecurityLevel(server);
        if(node.threads > 0){
            collection.push(node);
        }
    });

    // Sort servers in order of threads
    collection.sort((a, b) => a.threads > b.threads ? 1 : -1);

    // Total number of servers that have threads
    let totalServers = collection.length;

    // Find the min and max threads (unused but quite cool!)
    let [minThreads, maxThreads] = collection.reduce(([prevMin,prevMax], {threads})=>
    [Math.min(prevMin, threads), Math.max(prevMax, threads)], [Infinity, -Infinity]);

    // Define variables for finding the amount of threads to
    // divide across the servers on the network
    let weakenThreadsPerServer = analyze.threads.requiredToWeaken / totalServers,
        totalWeakenRemainingThreads = 0,
        threadsWeakenPerServerAdditional = 0;

    let growThreadsPerServer = analyze.increase.growth / totalServers,
        totalGrowRemainingThreads = 0,
        threadsGrowPerServerAdditional = 0;        

    let hackThreadsPerServer = analyze.threads.half / totalServers,
        totalHackRemainingThreads = 0,
        threadsHackPerServerAdditional = 0;        

    // Loop through the servers that have available threads    
    for( let i = 0; i < collection.length; i++ ) {

        // Calculate how many threads can be used for weaken        
        // 1. Calculate remainding threads after deducting server total        
        // 2. Set the new weaken value to the max threads 
        // 3. Total deficit is re-calculated
        // 4. Divide the total remaining threads between the rest of the servers
        // else 
        // Add the deficit onto to the total threads per server
        if(collection[i].threads < weakenThreadsPerServer){
            let remainingThreads = weakenThreadsPerServer - collection[i].threads;        
            collection[i].weaken = collection[i].threads;                        
            totalWeakenRemainingThreads = totalWeakenRemainingThreads + remainingThreads;
            threadsWeakenPerServerAdditional = totalWeakenRemainingThreads / (i + 1); 
        } else {
            collection[i].weaken = weakenThreadsPerServer + threadsWeakenPerServerAdditional;
        }

        // Calculate how many threads can be used for grow
        if(collection[i].threads < growThreadsPerServer){
            let remainingThreads = growThreadsPerServer - collection[i].threads;
            collection[i].grow = collection[i].threads;                    
            totalGrowRemainingThreads = totalGrowRemainingThreads + remainingThreads;
            threadsGrowPerServerAdditional = totalGrowRemainingThreads / (i + 1); 
        } else {
            collection[i].grow = growThreadsPerServer + threadsGrowPerServerAdditional;
        }

        // Calculate how many threads can be used for hack
        if(collection[i].threads < hackThreadsPerServer){
            let remainingThreads = hackThreadsPerServer - collection[i].threads;
            collection[i].hack = collection[i].threads;                    
            totalHackRemainingThreads = totalHackRemainingThreads + remainingThreads;
            threadsHackPerServerAdditional = totalHackRemainingThreads / (i + 1); 
        } else {
            collection[i].hack = hackThreadsPerServer + threadsHackPerServerAdditional;
        }

        // Hard code to MAX threads
        // WARNING: Drains server of all money

        // collection[i].weaken = collection[i].threads;
        // collection[i].grow = collection[i].threads;
        // collection[i].hack = collection[i].threads;

    }

    //console.log("Total money: $" + analyze.money);
    console.log(collection);
    //console.log(threads);
    console.log(analyze);
    
    // Stop all processes before starting loop
    await pm.stop(ns, servers);

    let securityBuffer = 5;
    let moneyMultiplier = 0.75; // 75% of the the max money

    while(true) {
        if (ns.getServerSecurityLevel(host) > ns.getServerMinSecurityLevel(host) + securityBuffer) {

            // If the server's security level is above our threshold, weaken it            
            console.log('Weakening server: ' + host + ' - Security ' + ns.getServerSecurityLevel(host) + '/' + (ns.getServerMinSecurityLevel(host) + 5));
            
            for( let i = 0; i < collection.length; i++ ) {

                if(ns.scriptRunning(appInterface.getHackScript(), collection[i].server)){
                    ns.killall(collection[i].server);
                }

                if(ns.scriptRunning(appInterface.getGrowScript(), collection[i].server)){
                    ns.killall(collection[i].server);
                }

                if(!ns.scriptRunning(appInterface.getWeakenScript(), collection[i].server)){
                    ns.exec(
                        appInterface.getWeakenScript(), 
                        collection[i].server, 
                        Math.ceil(collection[i].weaken),
                        host
                        );
                } 

            }
            await ns.sleep(ns.getWeakenTime(host));

        } else if (ns.getServerMoneyAvailable(host) < (ns.getServerMaxMoney(host) * moneyMultiplier)) {

            // If the server's money is less than our threshold, grow it            
            console.log('Growing server: ' + host + ' - Money ' + dollarUSLocale.format(ns.getServerMoneyAvailable(host)) + '/' + dollarUSLocale.format((ns.getServerMaxMoney(host) * moneyMultiplier)) );

            for( let i = 0; i < collection.length; i++ ) {

                if(ns.scriptRunning(appInterface.getHackScript(), collection[i].server)){
                    ns.killall(collection[i].server);
                }

                if(ns.scriptRunning(appInterface.getWeakenScript(), collection[i].server)){
                    ns.killall(collection[i].server);
                }

                if(!ns.scriptRunning(appInterface.getGrowScript(), collection[i].server)){
                    ns.exec(
                        appInterface.getGrowScript(), 
                        collection[i].server, 
                        Math.ceil(collection[i].grow),
                        host
                        );
                } 

            }
            await ns.sleep(ns.getGrowTime(host));

        } else {

             // Otherwise, hack it             
            console.log('Hacking server: ' + host + ' - Security: OK | Money: OK');
            for( let i = 0; i < collection.length; i++ ) {

                if(ns.scriptRunning(appInterface.getWeakenScript(), collection[i].server)){
                    ns.killall(collection[i].server);
                }

                if(ns.scriptRunning(appInterface.getGrowScript(), collection[i].server)){
                    ns.killall(collection[i].server);
                }

                if(!ns.scriptRunning(appInterface.getHackScript(), collection[i].server)){
                    ns.exec(
                        appInterface.getHackScript(), 
                        collection[i].server, 
                        Math.ceil(collection[i].hack),
                        host
                        );
                } 

            }

            await ns.sleep(ns.getHackTime(host));

        }
    }

}