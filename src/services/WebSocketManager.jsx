import React, { useEffect, useState } from 'react';
import { notification as antdNotification } from 'antd';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { API_URL } from '../utils/constant';
import { useChangeRead } from '../utils/api';

const WebSocketManager = ({ user }) => {
  const { fetchChangeRead } = useChangeRead();
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!user) {
      console.error('User không tồn tại.');
      return;
    }

    const newClient = new Client({
      brokerURL: `ws://${API_URL.replace(/^http/, 'ws')}/ws`,  // URL của máy chủ WebSocket
      connectHeaders: {
        // Thêm bất kỳ headers cần thiết nào, ví dụ: Authentication headers
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => new SockJS(`${API_URL}/ws`),  // URL của SockJS server
    });

    newClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      console.log('Subscribing to topic: ' + `/topic/notifications/${user.userId}`);

      newClient.subscribe(`/topic/notifications/${user.userId}`, (message) => {
        if (message.body) {
          const newNotification = JSON.parse(message.body);
          console.log('Received notification: ', newNotification);

          antdNotification.open({
            message: newNotification.title,
            description: newNotification.message,
            onClick: () => {
              fetchChangeRead(newNotification.id, true).then(() => {
                if (newNotification.url) {
                  window.location.href = newNotification.url;
                }
              });
            },
            duration: 5,
          });
        }
      });
    };

    newClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    newClient.onWebSocketClose = () => {
      console.log('WebSocket connection closed.');
    };

    newClient.activate();
    setClient(newClient);

    return () => {
      if (newClient) {
        newClient.deactivate();
      }
    };
  }, [user, fetchChangeRead]);

  useEffect(() => {
    if (client && !client.connected) {
      console.log('Attempting to reactivate WebSocket client...');
      client.activate();
    }
  }, [client]);

  return null;
};

export default WebSocketManager;