console.log("NotificationHandler starting..");

const route = "https://mensario.herokuapp.com";


var gSubscription = "";
var loginStatus = false;
var userId = 0;
var rebuild;
var gEndpoint;
var gExpirationTime;
var gP256dh;
var gAuth;

function alarm(registration) {
    // console.log('running:');
    setTimeout(function(){
      alarm(registration);
      registration.showNotification("Alert!");
    }, 1*60*100);
}

function isBetween7and9() {
    // console.log('checking:');
    setTimeout(function() {
        //Send Notification
        let date = new Date();
        if(date.getHours() >= 0 && date.getHours() < 24) {

            fetch(route + '/sendNotification', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                //     'Access-Control-Allow-Origin': true
                },
                body: JSON.stringify({
                    subscription: gSubscription,
                    payload: getCurrentTimestamp() + " losgeschickt!",
                    delay: 3600,
                    ttl: 300,
                }),
            });
        } else {
            isBetween7and9();
        }
    }, 1*60*100);
}

const getCurrentTimestamp = () => {
    let date = new Date();
    date.setHours( date.getHours()+1 );
    // console.log("Date: " + date);
    return date.toISOString();
}

function showNotificationInSeconds(registration, seconds) {

    setTimeout(function() {
        registration.showNotification(getCurrentTimestamp() + " losgeschickt!", {
            body: 'Here is a notification body!',
            // showTrigger: new TimestampTrigger(timestamp),
            icon: 'images/logo.jpeg',
            vibrate: [100, 50, 100],
            data: {
              dateOfArrival: Date.now(),
              primaryKey: 1
            },
            actions: [
                {
                  action: 'open',
                  title: 'Open app',
                },
                {
                  action: 'close',
                  title: 'Close notification',
                }
            ]
        });
    }, seconds*1000);
}

const getDateIn2min = () => {
    let date = new Date();
    date.setHours( date.getHours()+1 );
    date.setMinutes( date.getMinutes()+2 );
    console.log("Firing in 2 minutes at: " + date);
    return date.toISOString();
}


window.onload = function() {

    navigator.serviceWorker.ready
    .then(function(registration) {

        console.log("Service Worker is ready!");
        // registration.waitUntil(alarm(registration));
        // registration.waitUntil(isBetween7and9(registration));
        
        // Use the PushManager to get the user's subscription to the push service.
        return registration.pushManager.getSubscription()
        .then(async function(subscription) {
            // If a subscription was found, return it.
            if (subscription) {
                // console.log("Subscription found!");
                return subscription;
            }
            
            // Get the server's public key
            const response = await fetch(route + '/vapidPublicKey');
            const vapidPublicKey = await response.text();
            // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
            // console.log("VapidPublicKey: " + vapidPublicKey);
            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

            // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
            // send notifications that don't have a visible effect for the user).
            return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });
        });
    }).then(function(subscription) {
            // Send the subscription details to the server using the Fetch API.
        
            if(loginStatus)
            {
                registerSubscription(subscription);
            }
            else {
                gSubscription = subscription;
            }

            // if(document.getElementById('username') === null)
            // {
            //     console.log("Username don't exists yet!");
            // }

            document.getElementById('login').onclick = function()
            {
                // console.log("Login clicked!");
                setTimeout(isUserLoggedIn, 3000);
            }


            document.getElementById('sendMyNotification').onclick = async function()
            {
                // navigator.serviceWorker.ready
                // .then( (swRegistration) => {
                //     swRegistration.sync.register('bing');
                //     console.log("Sending sync...");
                // }).catch(console.log);

                console.log("Sending Notification..");
                document.getElementById('pTag').innerHTML = "Sending Notification..";
                const payload = document.getElementById('notification-payload').value;
                const delay = document.getElementById('notification-delay').value;
                const ttl = document.getElementById('notification-ttl').value;

                // Fetch subscription from database
                fetch(route + `/getSubscription/${userId}`, {
                    method: 'get',
                    // mode: 'no-cors',
                }).then( response => {
                    // console.log("Clicked Response Raw: " + response);
                    // console.log("Clicked Response Data: " + response.data);
                    // console.log("Clicked Response: " + JSON.stringify(response));
                    // console.log("Clicked Response Endpoint: " + response.endpoint);
                })
                await getSubscriptionFromDatabase();


                // Ask the server to send the client a notification (for testing purposes, in actual
                // applications the push notification is likely going to be generated by some event
                // in the server).
                await fetch(route + '/sendNotification', {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    //     'Access-Control-Allow-Origin': true
                    },
                    body: JSON.stringify({
                        subscription: gSubscription.subscription,
                        payload: payload,
                        delay: delay,
                        ttl: ttl,
                    }),
                });
            };
    });
}


const rebuildSubscription = (endpoint, expTime, p256dh, auth) => {

    let rebuild = {"subscription": {
        "endpoint":endpoint,
        "expirationTime":expTime,
        "keys":
            {
                "p256dh":p256dh,
                "auth":auth
            }
        }
    };
    return rebuild;
}


const getSubscriptionFromDatabase = () => {

    return new Promise((resolve,reject) => {
        fetch(route + `/getSubscription/${userId}`)
            .then(response => response.json())
            .then(data => {
                // console.log("getSubscriptionFromDatabase: " + data[0]);
                // console.log("getSubscriptionFromDatabase: " + data[0].endpoint);
                rebuild = rebuildSubscription(data[0].endpoint, data[0].expirationTime, data[0].p256dh, data[0].auth);
                setRebuild(rebuild);
                // console.log("Rebuild: " + JSON.stringify(rebuild));
                // console.log("Endpoint: " + data[0].endpoint);
                // console.log("Expiration Time: " + data[0].expirationTime);
                resolve();
            });
    });
}


function setRebuild(newRebuild)
{
    rebuild = newRebuild;
    gSubscription = newRebuild;
}


function registerSubscription(subscription) {

    console.log("RegisterSubscription: " + userId);
    console.log("RegisterSubscription: " + JSON.stringify(subscription));
    fetch(route + '/register', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        //     'Access-Control-Allow-Origin': true
        },
        body: JSON.stringify({
            subscription: subscription,
            userId: userId
        }),
    });
    console.log("Subscription sent to server.");
}


function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
   
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
   
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


function isUserLoggedIn() {
    if(document.getElementById("userTag"))
    {
        // console.log("User should be logged in now!");
        // console.log("UserId should be " + document.getElementById("userTag").value)
        
        userId = document.getElementById("userId").innerHTML.replace("(", "").replace(")", "");
        // console.log("UserId could be " + userId);
        loginStatus = true;

        registerSubscription(gSubscription);


        //Hier loop starten das prüft wie spät es ist
        isBetween7and9(); //lokal deaktivieren
    }
    else {
        // console.log("It seems like the user isn't logged in yet!")
        loginStatus = false;
        setTimeout(isUserLoggedIn, 3000);
    }
}