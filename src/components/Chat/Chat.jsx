import React, { useEffect, useState } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatImg from '../../assets/dummy-user.jpg'
import { getUserByDepId } from '../API/Request/User/getusersByDepartmentId';
import MessagesComponent from './MessagesComponent';
import SoundMessage from '../../assets/notification-sound.mp3'
import SettingComponent from '../Setting/SettingComponent';
import { useLocation } from 'react-router-dom';
import domain from '../API/domainAPI'
import { getPrivateChatMessages } from '../API/Request/Chat/getMessageOfPrivateChat';


const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState()
    const [receiverUsername, setReceiverUsername] = useState('')
    let {state} = useLocation();
    const [isReceiverOnline, setIsReceiverOnline] = useState(false)

    const currentUserUsername = localStorage.getItem('username');
    let depId = localStorage.getItem('depid');
    const latestMessage = messages[messages.length - 1];
    const BASE_URL = "https://chathubbe.hamrosystem.com";
    //const BASE_URL = "https://localhost:7183";

    const getAllUserByDepId = async () => {
        if (!depId) {
            depId = "empty";
        }
        await getUserByDepId(depId)
            .then(data => {
                setUsers(data);
            })
            .catch(err => {
                if (err.response && err.response.status === 500) {
                    console.log("No Users found..")
                } else {
                    console.log("server error....");
                }
            })
    }
    const createConnection = async () => {
        const token = localStorage.getItem('token');
        const connection = new HubConnectionBuilder()
            .withUrl(`${BASE_URL}/hamrochathub`, {
                accessTokenFactory: () => token,
            })
            //.configureLogging(LogLevel.Information)
            .build();

        connection.on('ReceiveMessage', (senderUsername, receiverUsername, message) => {
            setMessages(messages => [...messages, { senderUsername, receiverUsername, message }])
            if (currentUserUsername === receiverUsername) {
                playNotificationSound();
            }
        });


        try {
            await connection.start();
            // console.log('Connection established...');
        } catch (error) {
            console.error('Error starting connection:', error);
        }
        setConnection(connection);
    };

    const playNotificationSound = () => {
        const audio = document.getElementById('messageSound');
        audio.play();
    }

    const getMessageOfPrivateChats = async () => {
        if(currentUserUsername && receiverUsername){
          await getPrivateChatMessages(currentUserUsername,receiverUsername)
          .then(data =>{
            setMessages([]);
            data.forEach(m => {
                setMessages(messages => [
                     ...messages,
                    { senderUsername: m.senderUsername, receiverUsername: m.receiverUsername, message: m.messages }
                ]);
            });
          })
          .catch(err =>{
    
          })
        }
      }

    const checkUserStatus = async (receiverUserUsername) => {
        if(connection){
            debugger;
            const isOnline = await connection.invoke("IsUserOnline", receiverUserUsername)
            setIsReceiverOnline(isOnline);
        }
    } 
    useEffect(() => {
        (async () => {
            await createConnection();
            await getAllUserByDepId();
            await getMessageOfPrivateChats();
        })();
    }, [userId]);

    

    return (
        <div className='col-md'>
            <div className='row'>
                {state?.showSettingComp ? <SettingComponent /> : (
                    <div className="col-md-4 users__lists__container overflow-auto">
                        <div className="users__lists p-4 ">
                            <div className="chat__logo__container">
                                <h4>Chats</h4>
                            </div>
                            <div className="my-3">
                                <form action="" className="search__form__container" >
                                    <i className="fa-solid fa-magnifying-glass search__icon"></i>
                                    <input type="search" className="form-control search__form" placeholder="search user" />
                                </form>
                            </div>
                            <div className="users" >
                                {users.map((user, index) => {
                                    return (
                                        <a key={index} onClick={() => {setUserId(user.userId);setReceiverUsername(user.username);getMessageOfPrivateChats();checkUserStatus(user.username)}}>
                                            <div className="row user_design my-3">
                                                <div className="col-auto">
                                                    <div className="user__image">
                                                        <img 
                                                        src={user?.profilePictureULR ? `${domain}${user?.profilePictureULR}` : ChatImg}
                                                         alt="user-image" />
                                                    </div>
                                                </div>
                                                <div className="col p-0 m-0">
                                                    <div className="user__info">
                                                        <h5 className="user__name">{user.username}</h5>
                                                        <span>12:01 AM</span>
                                                    </div>
                                                    <div className="user__message">
                                                        <div className="line-clamp">
                                                            {latestMessage?.senderUsername === user.username || latestMessage?.receiverUsername === user.username ? latestMessage.message : null}
                                                        </div>
                                                        {/* <div className="badge">
                                      <span></span>
                                  </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <div className="col-md-7 p-2 chat__container">
                    {userId ? <MessagesComponent id={userId} connection={connection} messages={messages} isReceiverOnline={isReceiverOnline} /> : null}
                </div>
            </div>
            <audio id="messageSound">
                <source src={SoundMessage} type="audio/mpeg" />
            </audio>
        </div>
    )
}

export default Chat
