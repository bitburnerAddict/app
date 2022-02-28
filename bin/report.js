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
    
    console.log(reports);
    console.log("Total hacked servers: " + hackedServers.length + "/" + allServers.length);

}

export async function scriptInfo(ns, allServers) {

    let report = {};

    let host = 'max-hardware';

    report.scripts = {}
    report.scripts.ram = {}
    report.time = {}
    report.targets = {}
    report.tests = {}

    report.scripts.ram.hack = ns.getScriptRam('/scripts/hacks/hack.js', 'home');
    report.scripts.ram.grow = ns.getScriptRam('/scripts/hacks/grow.js', 'home');
    report.scripts.ram.weaken = ns.getScriptRam('/scripts/hacks/weaken.js',  'home');

    report.time.hack = ns.getHackTime(host);
    report.time.grow = ns.getGrowTime(host);    
    report.time.weaken = ns.getWeakenTime(host);

    let offset = 1000; // 1000ms gap between the 4 stages

    // Hack, weaken, grow, weaken timings
    report.targets.hackWeakenStart = offset;
    report.targets.hackStart = (report.time.weaken - report.time.hack);
    report.targets.growWeakenStart = (offset * 3);
    report.targets.growStart = (report.time.weaken - report.time.grow) + (offset * 2);

    // Tests
    report.tests.a = report.targets.hackStart + report.time.hack;
    report.tests.b = report.targets.hackWeakenStart + report.time.weaken;        
    report.tests.c = report.targets.growStart + report.time.grow;
    report.tests.d = report.targets.growWeakenStart + report.time.weaken;

    // Formatting for console output
    report.targets.hackStart = time.secondsToDhms(report.targets.hackStart / 1000);
    report.targets.growStart = time.secondsToDhms(report.targets.growStart / 1000);
    report.tests.a = time.secondsToDhms(report.tests.a / 1000);
    report.tests.b = time.secondsToDhms(report.tests.b / 1000);
    report.tests.c = time.secondsToDhms(report.tests.c / 1000);
    report.tests.d = time.secondsToDhms(report.tests.d / 1000);
    report.time.hack = time.secondsToDhms(report.time.hack / 1000);
    report.time.grow = time.secondsToDhms(report.time.grow / 1000);
    report.time.weaken = time.secondsToDhms(report.time.weaken / 1000);

    console.log(report);
    return report;

}
