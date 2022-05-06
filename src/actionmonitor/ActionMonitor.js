import React, { useEffect, useState } from "react";
import "./actionmonitor.css";

import SockJS from "sockjs-client";
import {useRecoilState} from "recoil";
import {actionMonitors, chatMessages} from "../atom/globalState";
import ScrollToBottom from "react-scroll-to-bottom";

var stompClient = null;
const ActionMonitor = (props) => {

    const [incomingmsgs, setIncomingMessages] = useRecoilState(actionMonitors);


    useEffect(() => {
        connect();
    }, []);

    const connect = () => {
        const Stomp = require("stompjs");
        var SockJS = require("sockjs-client");
        SockJS = new SockJS("http://localhost:8081/ws");
        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        console.log("connected");
        stompClient.subscribe(
            "/user/actionmonitor/queue/messages",
            onMessageReceived
        );
    };

    const onMessageReceived = (msg) => {
        const actionMessage = JSON.parse(msg.body);
        /*const newMessages = [...incomingmsgs];
        newMessages.push(actionMessage);
        setIncomingMessages(newMessages);*/
        const newMessages = JSON.parse(sessionStorage.getItem("recoil-persist"))
            .actionMonitors;
        newMessages.push(actionMessage);
        setIncomingMessages(newMessages);
    }

    const onError = (err) => {
        console.log(err);
    };

    return (
        <div id="action-monitor" className="action-monitor">websocket connection established
            <div className="actionmonitorcontent">
            <ScrollToBottom className="messages">
                    <ul>
                        {incomingmsgs.map((msg) => (
                            <li>
                                <p>{msg}</p>
                            </li>
                        ))}
                    </ul>
                </ScrollToBottom>
            </div>
        </div>
    );
}

export default ActionMonitor