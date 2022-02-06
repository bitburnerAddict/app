/** @param {NS} ns **/
export async function main(ns) {
    // Parameters
    // param 1: Server you want to hack
    // param 2: OPTIONAL - Server you want to start the hack from, i.e. any public servers, purchased servers or 'home'
    //
    // EXAMPLE 1: run masterHack.js joesguns
    // This will start hacking 'joesguns' using the RAM of 'joesguns'
    //
    // EXAMPLE 2: run masterHack.js joesguns s1
    // This will start hacking 'joesguns' using the RAM of my purchased server 's1'
    //
    // This 'masterHack.js' process will stay active on whatever server you execute it from.
    // I usually start it from 'home', then I can track all my earnings in one place.
    // Keep in mind, when using 'home' as second parameter the script might use all available RAM
    // and you might become unable to execute any other scripts on 'home' until you kill the process.

    var target = ns.args[0];
    var serverToHackFrom = target; // For single argument calls - server will hack itself
    var hackScript = "hack.js";
    var growScript = "grow.js";
    var weakenScript = "weaken.js";
    var growScriptRAM = ns.getScriptRam(growScript);
    var serverMaxMoney = ns.getServerMaxMoney(target);
    var serverMaxRAM;
    // var batchServers;
    var moneyThresh = serverMaxMoney * 0.9; // 0.90 to maintain near 100% server money. You can use 0.75 when starting out/using low thread counts
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    var currentServerMoney;
    var currentServerSecurity;
    var useThreadsHack, useThreadsWeaken1, useThreadsWeaken2, useThreadsGrow;
    var possibleThreads;
    var maxHackFactor = 0.01;
    var growWeakenRatio = 0.9; // How many threads are used for growing vs. weaking (90:10).
    var sleepTimeHack, sleepTimeGrow, sleepTimeWeaken, sleepDelay = 200; // Sleep delay should range between 20ms and 200ms as per the documentation. I'll keep the default at 200, adjust as needed. 

    // If second argument is provided, hack will run from this server instead
    if (ns.args[1]) {
        /* if(ns.args[1] == "batch")
        batchServers = ns.getPurchasedServers();
        else */
        serverToHackFrom = ns.args[1];
    }
    serverMaxRAM = ns.getServerMaxRam(serverToHackFrom);

    // Gain root access. Make sure you have the nuke.js script on 'home'
    if (!ns.hasRootAccess(target)) {
        ns.exec("nuke.js", "home", 1, target);
        await ns.sleep(1000);
    }

    // Copy the work scripts, if not already on server
    if (!ns.fileExists(hackScript, serverToHackFrom)) {
        await ns.scp(hackScript, "home", serverToHackFrom);
    }
    if (!ns.fileExists(growScript, serverToHackFrom)) {
        await ns.scp(growScript, "home", serverToHackFrom);
    }
    if (!ns.fileExists(weakenScript, serverToHackFrom)) {
        await ns.scp(weakenScript, "home", serverToHackFrom);
    }

    // To prevent the script from crashing/terminating after closing and restarting the game.
    while (ns.isRunning(hackScript, serverToHackFrom, target) || ns.isRunning(growScript, serverToHackFrom, target) || ns.isRunning(weakenScript, serverToHackFrom, target)) {
        await ns.sleep(10000);
    }

    // Main loop - will terminate if no RAM available
    while (3 < (possibleThreads = Math.floor((serverMaxRAM - ns.getServerUsedRam(serverToHackFrom)) / growScriptRAM))) {
        currentServerMoney = ns.getServerMoneyAvailable(target);
        currentServerSecurity = ns.getServerSecurityLevel(target);

        // The first to cases are for new servers with high SECURITY LEVELS and to quickly grow the server to above the threshold
        if (currentServerSecurity > securityThresh && currentServerMoney < moneyThresh) {
            sleepTimeWeaken = ns.getWeakenTime(target) + sleepDelay; // Added 100 milliseconds to the 'sleepTime' variables to prevent any issues with overlapping work scripts
            ns.exec(growScript, serverToHackFrom, Math.ceil(possibleThreads / 2), target);
            ns.exec(weakenScript, serverToHackFrom, Math.floor(possibleThreads / 2), target);
            await ns.sleep(sleepTimeWeaken); // wait for the weaken command to finish
        } else if (currentServerMoney < moneyThresh) {
            sleepTimeWeaken = ns.getWeakenTime(target) + sleepDelay;
            ns.exec(growScript, serverToHackFrom, Math.floor(possibleThreads * growWeakenRatio), target);
            ns.exec(weakenScript, serverToHackFrom, Math.ceil(possibleThreads * (1 - growWeakenRatio)), target);
            await ns.sleep(sleepTimeWeaken); // wait for the weaken command to finish
        } else {
            // Define max amount that can be restored with one grow and therefore will be used to define hack threads.
            // The max grow threads are considering the weaken threads needed to weaken hack security and the weaken threads needed to weaken grow security.
            // I didn't bother optimizing the 'growWeakenRatio' further, as 90% is good enough already. It will be just a few more hack threads, if any at all - even with large RAM sizes.
            while (maxHackFactor < 0.999 &&
                Math.floor((possibleThreads - (useThreadsHack = Math.floor(ns.hackAnalyzeThreads(target, currentServerMoney * maxHackFactor))) - Math.ceil(useThreadsHack / 25)) * growWeakenRatio) >
                Math.ceil(ns.growthAnalyze(target, serverMaxMoney / (serverMaxMoney * (1 - maxHackFactor))))) {
                maxHackFactor += 0.001; // increase by 0.1% with each iteration
            }
            maxHackFactor -= 0.001; // Since it's more than 'possibleThreads' can handle now, we need to dial it back once.
            useThreadsHack = Math.floor(ns.hackAnalyzeThreads(target, currentServerMoney * maxHackFactor)); // Forgot this in the first version.
            useThreadsWeaken1 = Math.ceil(useThreadsHack / 25); // You can weaken the security of 25 hack threads with 1 weaken thread
            useThreadsGrow = Math.floor((possibleThreads - useThreadsWeaken1 - useThreadsHack) * growWeakenRatio);
            useThreadsWeaken2 = possibleThreads - useThreadsHack - useThreadsGrow - useThreadsWeaken1;
            sleepTimeHack = ns.getHackTime(target);
            sleepTimeGrow = ns.getGrowTime(target);
            sleepTimeWeaken = ns.getWeakenTime(target);
            ns.exec(weakenScript, serverToHackFrom, useThreadsWeaken1, target, "1");
            await ns.sleep(2 * sleepDelay);
            ns.exec(weakenScript, serverToHackFrom, useThreadsWeaken2, target, "2"); // Second weaken script runs after the first
            await ns.sleep(sleepTimeWeaken - sleepTimeGrow - sleepDelay);
            ns.exec(growScript, serverToHackFrom, useThreadsGrow, target); // Grow script ends before second weaken script
            await ns.sleep(sleepTimeGrow - sleepTimeHack - 2 * sleepDelay);
            ns.exec(hackScript, serverToHackFrom, useThreadsHack, target); // Hack script ends before first weaken script
            await ns.sleep(sleepTimeHack + 4 * sleepDelay); // wait after second weaken script
            maxHackFactor = 0.01;
        }
    }
    ns.tprint("Script was terminated. Not enough RAM available on '" + serverToHackFrom + "'.")
}