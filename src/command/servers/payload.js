import * as app from './src/app/interface';
import * as time from './src/util/time';
import * as calc from './src/util/calc';

/**
 * 
 * @param {NS} ns 
 */
export async function main(ns){   
    
}

export async function build(ns, target){

    let securityThresh = ns.getServerMinSecurityLevel(target) + app.getSecurityBuffer();
    let moneyThresh = ns.getServerMaxMoney(target) * app.getMoneyPercentLimit();

    let securityLevel = ns.getServerSecurityLevel(target);
    let minSecurityLevel = ns.getServerMinSecurityLevel(target);
    let money = ns.getServerMoneyAvailable(target);

    let growTime = ns.getGrowTime(target);
    let hackTime = ns.getHackTime(target);
    let weakenTime = ns.getWeakenTime(target);

    let payload = {
        target: target, 
        money: money,            
        moneyMax: ns.getServerMaxMoney(target),
        moneyThresh: moneyThresh,
        moneyRequired: moneyThresh - money,
        moneyPerThread: ns.hackAnalyze(target),
        security: securityLevel,
        securityMin: minSecurityLevel,
        securityThresh: securityThresh,
        securityReductionRequired: securityLevel - minSecurityLevel,
        level: ns.getServerRequiredHackingLevel(target),
        formattedMoney: {},
        growth: ns.getServerGrowth(target),
        growTime: growTime,
        growTimeFormatted: time.secondsToDhms(growTime / 1000),
        hackTime: hackTime,
        hackTimeFormatted: time.secondsToDhms(hackTime / 1000),
        weakenTime: weakenTime,
        weakenTimeFormatted: time.secondsToDhms(weakenTime / 1000),
        threadsHack: ns.hackAnalyzeThreads(target, app.getHackAmount()),
        threadsWeakenAnalyze: ns.weakenAnalyze(8),
        threadsWeaken: ((securityLevel - minSecurityLevel) / ns.weakenAnalyze(8)),
        threadsTotal: ns.getServerMaxRam(target) / 2,
        threadsAvailable: (ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / 2,
        threadsUsed: (ns.getServerUsedRam(target)) / 2,
        timings: calc.getTimings(ns, target),
        ram: ns.getServerMaxRam(target),
        ramUsed: ns.getServerUsedRam(target),
        ramAvailable: ns.getServerMaxRam(target) - ns.getServerUsedRam(target)
    }

    payload = formatMoney(payload);

    // Calculate grow multiplier
    // Y = P% * X
    let decimal = money / moneyThresh;
    decimal = 1 + (1 - decimal);

    payload.moneyDiff = 0;
    
    if(decimal >= 1){
        payload.threadsGrow = ns.growthAnalyze(target, decimal);
        payload.moneyMultiplied = ns.getServerMoneyAvailable(target) * decimal;
        payload.moneyDiff = (moneyThresh - ns.getServerMoneyAvailable(target)) - (ns.getServerMoneyAvailable(target) * decimal);
    }

    // Calculate 1,000,000 of current money
    payload.hackValue = 1000000;
    payload.hackMultiplier = isFinite(payload.hackValue/ns.getServerMoneyAvailable(target));

    let growMultiplier = 1;
    if(isFinite(payload.hackValue/ns.getServerMoneyAvailable(target))){
        growMultiplier = 1 + payload.hackValue/ns.getServerMoneyAvailable(target);
    }

    payload.threadsGrow = ns.growthAnalyze(target, growMultiplier);

    return payload;

}

export function formatMoney(payload) {
    let dollarUSLocale = Intl.NumberFormat('en-US');
    payload.formattedMoney.money = dollarUSLocale.format(payload.money);
    payload.formattedMoney.moneyMax = dollarUSLocale.format(payload.moneyMax);
    payload.formattedMoney.moneyThresh = dollarUSLocale.format(payload.moneyThresh);
    payload.formattedMoney.moneyPerThread = dollarUSLocale.format(payload.moneyPerThread);   
    return payload; 
}