/**
 * 
 * @param {NS} ns 
 */
import * as app from './src/app/interface';

/**
 * 
 * @param {*} ns 
 * @param {*} servers 
 */
export async function main(ns, servers){   
    if(ns.fileExists(app.getDeployScript(), 'home')){
        for(let i in servers){
            await file(ns, app.getDeployScript(), servers[i]);
        }
    }
}

/**
 * 
 * @param {*} ns 
 * @param {*} file 
 * @param {*} server 
 */
export async function file(ns, file, server){
    if(!ns.fileExists(file, server)) {
        if(await ns.scp(file, server)) {
            ns.print('SUCCESS: Uploaded ' + file + ' to ' + server);
        } else {
            ns.print('ERROR: Uploading ' + file + ' to ' + server);
        }
    } else {
        ns.print('SUCCESS: ' + file + ' already exists on ' + server);
        await ns.scp(file, server);
    }
}
