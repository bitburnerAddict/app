/**
 * report.js - Report Generator
 * ==============================================
 */

import * as resource from './bin/resource';
import * as appInterface from './bin/appInterface';
import * as security from './bin/security';
import * as servers from './bin/servers';
import * as time from './bin/time';

/** @param {NS} ns **/
export async function main(ns, allServers) {

    let report = {};

    report.script               = appInterface.getEarlyHackingScript();
    report.ramScript            = ns.getScriptRam(report.script);
    report.ramLocalTotal        = ns.getServerMaxRam('home');
    report.ramLocalAvailable    = resource.getAvailableServerRam(ns, 'home');
    report.hackingLevel         = ns.getHackingLevel();
    report.timeSinceAugInstall  = time.secondsToDhms(ns.getTimeSinceLastAug() / 1000);
    report.mostEfficentServer   = await servers.getTarget(ns, allServers);
    report.purchsedServerLimit  = ns.getPurchasedServerLimit();

    console.table(report);
    
}

export async function serverInfo(ns, allServers) {

    let reports = [];
    let hackedServers = [];

    for( let i = 0; i < allServers.length; i++ ) {
        
        let report = {};

        report.server           = allServers[i];
        report.hackingLevel     = ns.getServerRequiredHackingLevel(report.server);
        report.securityLevel    = ns.getServerSecurityLevel(report.server);
        report.canHack          = security.canHack(ns, report.server);        
        report.securityMinLevel = ns.getServerMinSecurityLevel(report.server);
        report.securityLevel    = ns.getServerSecurityLevel(report.server);

        report.hasEarlyScriptRunning    = ns.isRunning(appInterface.getEarlyHackingScript(), report.server)
        report.hasDynamicScriptRunning  = ns.isRunning(appInterface.getDynamicScript(), report.server)        

        if(report.hasEarlyScriptRunning || report.hasDynamicScriptRunning){
            hackedServers.push(report.server);
        }

        reports.push(report);

    }
    
    console.log("Total hacked servers: " + hackedServers.length + "/" + allServers.length);

}
