export function get(name){

    let icon;

    switch(name){
        case 'hack':
            icon = '💵';
            break;
        case 'grow':
            icon = '🌱';
            break;
        case 'weaken':
            icon = '☠️';
            break;
        case 'lock':
            icon = '🔒';
            break;
        case 'unlock':
            icon = '🔓';
            break;
        case 'info':
            icon = '💬';
            break;
        case 'error':
            icon = '❗';
            break;
        case 'success':
            icon = '✅';
            break;
        case 'no-entry':
            icon = '⛔';
            break;
        case 'target':
            icon = '🎯';
            break;
        case 'nuke':
            icon = '☢️';
            break;
        case 'worker':
            icon = '💻';
            break;
    
    }

    return icon;
}

/**
 * 
 * @param {NS} ns 
 */
export async function main(ns){

}