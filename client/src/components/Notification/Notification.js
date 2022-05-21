import React, { useState } from 'react';
import './notification.css';

const Notification = ( {user} ) => {

    const [payload, setPayload] = useState("Insert payload here.");
    const [delay, setDelay] = useState("5");
    const [TTL, setTTL] = useState("5");

    const payloadChangeHandler = (event) => {
        setPayload(event.target.value);
    }

    const delayChangeHandler = (event) => {
        setDelay(event.target.value);
    }

    const TTLChangeHandler = (event) => {
        setTTL(event.target.value);
    }

    const getCurrentTimestamp = () => {
        let date = new Date();
        date.setHours( date.getHours()+1 );
        // console.log("Date: " + date);
        return date.toISOString();
    }

  return (
    <div className="notification">
        <hr></hr>
        <p id="pTag" className="pTag">This demo shows how our app sends push notifications with a payload.</p>
        <p>Current Time: {getCurrentTimestamp()}</p>

        <form className="form">
            Notification payload: <input id='notification-payload' type='text' value={payload} onChange={payloadChangeHandler}></input><br/>
            Notification delay: <input id='notification-delay' type='number' value={delay} onChange={delayChangeHandler}></input> seconds<br/>
            Notification Time-To-Live: <input id='notification-ttl' type='number' value={TTL} onChange={TTLChangeHandler}></input> seconds<br/>
        </form>
        <br/>
        <button className="button" id="sendMyNotification">Request sending a notification!</button>
    </div>
  );
}


export default Notification;