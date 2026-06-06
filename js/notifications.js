export function showNotification(msg){

if(Notification.permission === "granted"){

new Notification(msg);

}

}