/**
 * 
 * @param {NS} ns 
 */
import * as app from './src/app/interface';

export async function main(ns){   

    let i = 0, 
        ram = 8,
        time = Date.now();

    while (i < await ns.getPurchasedServerLimit()) {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            var hostname = ns.purchaseServer(app.getServerPattern() + time, ram);
            await ns.scp(app.getDeployScript(), hostname);       
            ++i;
        }
        await ns.sleep(50);
    }

}
