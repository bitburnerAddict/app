/**
 * App Interface
 * 
 * @param {NS} ns 
 */

/**
 * Early game variables
 */
let target = 'n00dles';

/**
 * Server purchase variables
 */
let pattern = 'pserv-';

/**
 * Deploy variables
 */
let deploy = '/src/util/deploy.js';
let deployDelay = 50;

/**
 * Hack/Grow/Weaken limits
 * 
 */

// Most aggressive ratios
// let ratios = {
//     g: 87.5,
//     gW: 12.5,
//     h: 75,
//     hW: 25
// };

// 900000 = 15mins
// 1.8e+6 = 30mins
// 1.44e+7 = 4hrs

let debugDelay = 20;

let securityBuffer = 5;
let moneyPercentLimit = 0.75;
let hackAmount = 1e6; // 1 million
let weakenTimeLimit = 300000; // 30 minutes

let hackRamLimit = 32; 
let growRamLimit = 4;
let weakenRamLimit = 2; 

let maxThreads = 16;

// Early game numbers
let hackProcessLimit = 8;
let processLimit = 24; 

// Thread limits should be calculated total available RAM across network
// number of hack jobs  

// Late game numbers
// let hackProcessLimit = 72;
// let processLimit = 48; 

let ratios = {
    g: 0.6,
    gW: 0.4
};

let hackRatios = {
    g: 0.25,
    gW: 0.25,
    h: 0.25,
    hW: 0.25
};

export function getDebugDelay(){
    return debugDelay;
}

export function getTarget(){
    return target;
}

export function getHackProcessLimit(){
    return hackProcessLimit;
}

export function getProcessLimit(){
    return processLimit;
}

export function getMaxThreads(){
    return maxThreads;
}

export function getServerPattern() {
    return pattern;
}

export function getHackRamLimit() {
    return hackRamLimit;
}

export function getGrowRamLimit() {
    return growRamLimit;
}

export function getWeakenRamLimit() {
    return weakenRamLimit;
}

export function getRatios(){
    return ratios;
}

export function getHackRatios(){
    return hackRatios;
}

export function getDeployDelay() {
    return deployDelay;
}

export function getDeployScript() {
    return deploy;
}

export function getSecurityBuffer() {
    return securityBuffer;
}

export function getMoneyPercentLimit() {
    return moneyPercentLimit;
}

export function getHackAmount() {
    return hackAmount;
}

export function getWeakenTimeLimit() {
    return weakenTimeLimit;
}

/**
 * 
 * @param {NS} ns 
 */
 export async function main(ns){}