/**
 * Hack Interface
 * ==============================================
 * Place to store common features across the app
 * 
 */

let earlyHackingScript      = '/scripts/hacks/early-hack-template.script';
let dynamicScript           = '/scripts/hacks/hack.script';
let hackGrowWeakenScript    = '/scripts/hacks/hack-grow-weaken.js';
let hack                    = '/scripts/hacks/hack.js';
let grow                    = '/scripts/hacks/grow.js';
let weakean                 = '/scripts/hacks/weaken.js';
let serverNamingPattern     = 'pserv-';

/**
 * Get hack script name 
 * 
 * @returns string
 */
 export function getHackScript(){
    return hack;
}

/**
 * Get grow script name 
 * 
 * @returns string
 */
 export function getGrowScript(){
    return grow;
}

/**
 * Get weakean script name 
 * 
 * @returns string
 */
 export function getWeakenScript(){
    return weakean;
}

/**
 * Get early hacking script with n00dles hard coded
 * 
 * @returns string;
 */
export function getEarlyHackingScript(){
    return earlyHackingScript;
}

/**
 * Get dynamic script where server name can be set
 * 
 * @returns string
 */
export function getDynamicScript(){
    return dynamicScript;
}

/**
 * Get hack / grow / weaken script to run from local 
 * 
 * @returns string
 */
export function getHackGrowWeakenScript(){
    return hackGrowWeakenScript;
}

/**
 * Get server pattern name for purchasing servers
 * 
 * @returns string
 */
export function getServerPattern(){
    return serverNamingPattern;
}

/** @param {NS} ns **/
export async function main(ns) {
    
}