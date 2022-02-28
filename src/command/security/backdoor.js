/**
 * 
 * @param {NS} ns 
 */

 export async function main(ns, servers){   
 
    for(let i in servers){
        ns.connect(servers[i]);
        try {
            await ns.installBackdoor();
        } catch(err) {
            ns.tprint(error);
        }
    }
 
 }