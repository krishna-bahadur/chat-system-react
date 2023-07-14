import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const ChatComponent = ({ senderId, receiverId }) => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7183/hamrochathub')
      .build();

    newConnection
      .start()
      .then(() => {
        console.log('SignalR connection established.');
        setConnection(newConnection);
      })
      .catch((error) => {
        console.error('Error starting SignalR connection:', error);
      });

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (connection) {
      connection.on('ReceiveMessage', handleReceiveMessage);
    }
  }, [connection]);

  const handleReceiveMessage = (sender, message) => {
    debugger;
    console.log('Message received:', sender, message);
    setMessages((prevMessages) => [...prevMessages, { sender, message }]);
  };

  const handleSendMessage = async () => {
    try {
      await connection.invoke('SendMessage', senderId, receiverId, messageInput);
      console.log('Message sent successfully.');
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredMessages = messages.filter((msg) => msg.sender === senderId || msg.sender === receiverId);

  return (
    <div className='col-md my-5'>
      <div>
        {filteredMessages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong> {msg.message}
          </div>
        ))}
      </div>
      <div>
        <input
        className='col-md form-control w-25'
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
