/**
 * Hack Interface
 * ==============================================
 * Place to store common features across the app
 * 
 */

let script                  = '/scripts/hacks/early-hack-template.script';
let earlyHackingScript      = '/scripts/hacks/early-hack-template.script';
let dynamicScript           = '/scripts/hacks/hack.script';
let hackGrowWeakenScript    = '/scripts/hacks/hack-grow-weaken.js';
let serverNamingPattern     = 'pserv-';

/**
 * Get script name 
 * 
 * @deprecated;
 * @returns string
 */
export function getScript(){
    return script;
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
export function gethackGrowWeakenScript(){
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