/**
 * Bit.js - Version 2 of the application
 * 
 * Better structure and refactored code
 * @param {NS} ns 
 */

import * as calc from './src/util/calc';

// Server imports
import * as search from './src/command/servers/search';
//import * as purchase from './src/command/servers/purchase';
import * as status from './src/command/servers/status';

// Security imports
import * as hack from './src/command/security/hack';
import * as ports from './src/command/security/ports';
import * as inject from './src/command/security/inject';
//import * as backdoor from './src/command/security/backdoor';

export async function main(ns){
    
    /**
     * Server management
     */

    // Scan network
    let servers = search.main(ns);

    switch(ns.args[0]){

        case "start":
            await ns.run('bit.js', 1, 'hack');
            await ns.run('bit.js', 1, 'grow');
            await ns.run('bit.js', 1, 'weaken');
            //await ns.run('bit.js', 1, 'report'); 
            break;
        
        case "servers":
            servers.forEach(element => {
                console.log(ns.getServer(element));
            });
            break;

        case "early":
            
            if(!ns.scriptRunning('src/util/purchase.script', 'home')){
                await ns.run('src/util/purchase.script', 1);
            }
            
            await ports.main(ns, servers);
            await inject.main(ns, servers);
            await hack.main(ns, servers);
            break;

        case "inject":
            await inject.main(ns, servers);
            break;

        case "ports":
            await ports.main(ns, servers);
            break;

        case "backdoor":
            await backdoor.main(ns, servers);
            break;
    
        case "hack":
            await hack.main(ns, servers, 'hack');
            break;

        case "grow":
            await hack.main(ns, servers, 'grow');
            break;

        case "weaken":
            await hack.main(ns, servers, 'weaken');
            break;            

        case "report":
            await hack.main(ns, servers, 'report');
            break;            
                
        case "programs":
            while(true){
                let host = 'home'; 
                if(!ns.fileExists('FTPCrack.exe', host)
                || !ns.fileExists('relaySMTP.exe', host)
                || !ns.fileExists('HTTPWorm.exe', host)
                || !ns.fileExists('SQLInject.exe', host)){
                    await ns.run('src/util/programs.script', 1);
                }    
                await ns.sleep(2000);
            }
            break;

        case "status":
            await status.main(ns, servers);
            break;

        case "scripts":
            status.scripts(ns, servers, 'foodnstuff');
            break;
        
        case "threads":             
            console.log(status.getUsedRamAcrossNetwork(ns, servers.filter(node => calc.canHack(ns, node))));
            break;
                
        default: 
            break;
            
    }

}