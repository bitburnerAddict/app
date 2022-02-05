/** @param {NS} ns **/
export async function main(ns) {

    let target          = ns.args[0],
        moneyThresh     = ns.getServerMaxMoney(target) * 0.75,
        securityThresh  = ns.getServerMinSecurityLevel(target) + 5;

    while(true){
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            console.log('Weakening: ' + target);
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            console.log('Growing: ' + target);
            await ns.grow(target);
        } else {
            console.log('Hacking: ' + target);
            await ns.hack(target);
        }
    }

}