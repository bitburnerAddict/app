let noBrute = false;
let noFtp = false;
let noHttp = false;
let noSmtp = false;
let noSql = false;

let debug = false;

/**
 * 
 * @param {NS} ns 
 */
export async function main(ns, servers){
    for(let i in servers){
        hack(ns, servers[i]);
    }
}

/**
 * 
 * @param {*} ns 
 * @param {*} server 
 */
export function hack(ns, server, portsRequired, adminAcess){

    let openPortCount = openPorts(ns, server, adminAcess);

    if (!ns.hasRootAccess(server)) {
        if(portsRequired <= openPortCount){
            nuke(ns, server);
        }
     }

    let ports = openPorts(ns, server, adminAcess);
    return ports;
}

/**
 * 
 * @param {*} ns 
 * @param {*} server 
 */
export function nuke(ns, server){
    if(ns.fileExists('NUKE.exe')){
        ns.nuke(server);  
        //ns.print('☢️ SUCCESS: Nuking ' + server); 
    } else {
        ns.print('☢️ ERROR: NUKE.exe not found!'); 
    }
}

/**
 * 
 * @param {*} ns 
 * @param {*} server 
 * @returns 
 */
export function openPorts(ns, server, adminAcess){

    let openPorts = 0;
    ns.brutessh(server);
    ns.ftpcrack(server);
    ns.httpworm(server);
    ns.relaysmtp(server);
    ns.sqlinject(server);

    let programs = [
        'BruteSSH.exe',
        'FTPCrack.exe',
        'HTTPWorm.exe',
        'SQLInject.exe',
        'relaySMTP.exe'
    ];

    programs.forEach(file => {
        if(ns.ls('home', file).length > 0){
            openPorts++;
        }
    });

    return openPorts;

}
