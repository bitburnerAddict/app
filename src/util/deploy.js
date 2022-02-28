/**
 * 
 * @param {NS} ns 
 */
export async function main(ns){  

    switch(ns.args[0]){

        case "w":
            await ns.sleep(ns.args[2]);
            await ns.weaken(ns.args[1]);
            break;
        
        case "gW":
            await ns.sleep(ns.args[2]);
            await ns.weaken(ns.args[1]);
            break;

        case "hW":
            await ns.sleep(ns.args[2]);
            await ns.weaken(ns.args[1]);
            break;

        case "h":
            await ns.sleep(ns.args[2]);
            await ns.hack(ns.args[1]);
            break;         

        case "g":
            await ns.sleep(ns.args[2]);
            await ns.grow(ns.args[1]);
            break;         

        default: 
            break;
    }

}