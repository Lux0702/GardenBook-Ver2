import React, { useEffect } from 'react';
import { notification as antdNotification } from 'antd';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { API_URL } from '../utils/constant';
import { useChangeRead } from '../utils/api';

const WebSocketManager = ({ user }) => {
  const { fetchChangeRead } = useChangeRead();
  console.log('WebSocketManager  tồn tại.');

  useEffect(() => {
    if (!user) {
      console.error('User không tồn tại.');
      return;
    }

    try {
      const socketFactory = () => new SockJS(`${API_URL}/ws`);
      const client = Stomp.over(socketFactory);

      client.connect({}, (frame) => {
        console.log('Connected: ' + frame);

        client.subscribe(`/topic/notifications/${user.userId}`, (notification) => {
          const newNotification = JSON.parse(notification.body);
          console.log('newNotification.message', newNotification.message);

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
        });
      }, (error) => {
        console.error('Error connecting to WebSocket:', error);
      });

      return () => {
        if (client) {
          client.deactivate();
        }
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }, [user, fetchChangeRead]);

  return null;
};

export default WebSocketManager;
