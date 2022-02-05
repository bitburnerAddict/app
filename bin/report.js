/**
 * report.js - Report Generator
 * ==============================================
 */

import * as resource from './bin/resource';
import * as appInterface from './bin/appInterface';

/** @param {NS} ns **/
export async function main(ns) {

    let report = {};

    report.script               = appInterface.getScript();
    report.ramScript            = ns.getScriptRam(report.script);
    report.ramLocalTotal        = ns.getServerMaxRam('home');
    report.ramLocalAvailable    = await resource.getAvailableServerRam(ns, 'home');
    report.hackingLevel         = ns.getHackingLevel();
    report.timeSinceAugInstall  = secondsToDhms(ns.getTimeSinceLastAug() / 1000);

    console.table(report);

}

/**
 * Convert seconds to Days / Hours / Minutes / Seconds
 * @param {*} seconds 
 * @returns 
 */
function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}