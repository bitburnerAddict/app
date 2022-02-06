/**
 * 
 * @param {NS} ns 
 */
export async function main(ns){
    let analyze = {}

    let host = 'foodnstuff';

    analyze.times = {};
    analyze.times.weak = ns.getWeakenTime(host);
    analyze.times.grow = ns.getGrowTime(host);
    analyze.times.hack = ns.getHackTime(host);

    analyze.money = ns.getServerMoneyAvailable(host);
    analyze.security = ns.getServerSecurityLevel(host);

    analyze.increase = {};
    analyze.increase.security   = ns.hackAnalyzeSecurity(1);
    analyze.increase.growth     = ns.growthAnalyze(host, 2);

    analyze.decrease = {};
    analyze.decrease.weaken     = ns.weakenAnalyze(1);

    analyze.threads = {};
    analyze.threads.million     = ns.hackAnalyzeThreads(host, 1000000);

    analyze.moneyPerThread    = analyze.money/100 * ns.hackAnalyze(host);
    analyze.chance              = ns.hackAnalyzeChance(host);

    // Calculate threads needed to grow 100%
    let threadsToGrow = analyze.increase.growth;

    // Calculate threads needed to 50% of money
    let threadsToHackHalf = ns.hackAnalyzeThreads(host, analyze.money/2);

    // Calculate threads needed to 100% weaken server 
    let threadsToWeaken = analyze.security / analyze.decrease.weaken;
    
    let dollarUSLocale = Intl.NumberFormat('en-US');

    console.log("Threads to weaken: " + threadsToWeaken);  
    console.log("Threads to grow: " + threadsToGrow);  
    console.log("Threads to hack 50% of money: " + threadsToHackHalf);  
    console.log("Threads to hack $1,000,000 of money: " + analyze.threads.million);

    // Get the total number of threads available across the network

    // Smash the server until the security level is down 

    // then... 

    // Grow the server until it's at 200% of the money

    // When the server is at 150%, hack 50% of the money

    console.log("Total money: $" + dollarUSLocale.format(analyze.money));

    console.log(analyze);
}