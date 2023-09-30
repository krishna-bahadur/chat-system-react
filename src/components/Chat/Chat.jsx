import React, { useEffect, useState } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatImg from '../../assets/dummy-user.jpg'
import { getUserByDepId } from '../API/Request/User/getusersByDepartmentId';
import MessagesComponent from './MessagesComponent';
import SoundMessage from '../../assets/notification-sound.mp3'
import SettingComponent from '../Setting/SettingComponent';
import { useLocation } from 'react-router-dom';
import { hub, server, client } from '../API/domain'
import { getPrivateChatMessages } from '../API/Request/Chat/getMessageOfPrivateChat';
import chatIcon from '../../../src/assets/chat-icon.png'
import { getTimeFromDateTime } from '../Functions/Functions';
import { Modal } from 'react-bootstrap'
import Decryption from '../Utility/Decryption';
import E2EE from '@chatereum/react-e2ee';
import VideoCall from '../VideoCall/VideoCall';
import VideoComp from '../VideoCall/VideoComp';



const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [decrypted, setdecrypteds] = useState([]);
    const [userId, setUserId] = useState()
    const [receiverUsername, setReceiverUsername] = useState('');
    const [receiver, setReceiver] = useState('');
    const [caller, setCaller] = useState('');
    let { state } = useLocation();
    const [isReceiverOnline, setIsReceiverOnline] = useState(false);
    const [isMesageReceived, setIsMesageReceived] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [searchQuery, setSearchQuery] = useState();
    const [isIncomingCallModalOpen, setIsIncomingCallModalOpen] = useState(true);
    const [isRejectCall, setIsRejectCall] = useState(false);
    const [isInCall, setIsInCall] = useState(true);
    const [incomingCall, setIncomingCall] = useState(false);


    const currentUserUsername = localStorage.getItem('username');
    let depId = localStorage.getItem('depid');
    const latestMessage = messages[messages.length - 1];

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
            .withUrl(hub, {
                accessTokenFactory: () => token,
            })
            .configureLogging(LogLevel.None)
            .build();

        connection.on('ReceiveMessage', async (senderUsername, receiverUsername, EncryptedMessage, message, datetime, isFile) => {
            if(EncryptedMessage){
                if (currentUserUsername === senderUsername) {
                    const receiverPrivateKey = localStorage.getItem('privateKey');
                    const encrypted = JSON.parse(EncryptedMessage);
                    const decrypted = await E2EE.decrypt(
                        encrypted.aes_key,
                        encrypted.iv,
                        receiverPrivateKey,
                        encrypted.cipher_text
                    );
                    message = decrypted;
    
                }
                if (currentUserUsername === receiverUsername) {
                    const receiverPrivateKey = await connection.invoke("GetKey", senderUsername);
                    if (receiverPrivateKey) {
                        const encrypted = JSON.parse(EncryptedMessage);
                        const decrypted = await E2EE.decrypt(
                            encrypted.aes_key,
                            encrypted.iv,
                            receiverPrivateKey,
                            encrypted.cipher_text
                        );
                        message = decrypted;
                    } 
    
    
                }
            }

                getAllUserByDepId();
                setMessages(messages => [...messages, { senderUsername, receiverUsername, message, datetime, isFile }])
                if (currentUserUsername === receiverUsername) {
                    // playNotificationSound();
                    showNotification(senderUsername + ' send message.', message);
                }
            
        });

        if (connection.state === "Connected") {
            setConnection(connection);
            // console.log("Connection is already in the 'Connected' state.");
        } else {
            try {
                await connection.start();
                setConnection(connection);
            } catch (error) {
                // console.error('Error starting connection:', error);
            }
        }
    };

    const savePublicKey = async () => {
        const privateKey = localStorage.getItem("privateKey");
        await connection?.invoke('SaveKey', currentUserUsername, privateKey);
    }

    const playNotificationSound = () => {
        const audio = document.getElementById('messageSound');
        audio.play();
    }

    connection?.on('IncomingCall', (caller, receiver) => {
        //showIncomingCallModal();
        setReceiver(receiver);
        setCaller(caller);
    });
    connection?.on('ReceiveStartVideoChat',() => {
        setIncomingCall(true);
    });

    // connection?.on('CallFailed', (receiverUsername) => {
    //     debugger;

    // });

    const showNotification = (title, message) => {
        const options = {
            body: message,
        };
        const notification = new Notification(title, options);

        notification.addEventListener("click", () => {
            window.open(client);
        })
    }

    const getMessageOfPrivateChats = async () => {
        if (currentUserUsername && receiverUsername) {
            await getPrivateChatMessages(currentUserUsername, receiverUsername)
                .then(data => {
                    setMessages([]);
                    data.forEach(m => {
                        setMessages(messages => [
                            ...messages,
                            { senderUsername: m.senderUsername, receiverUsername: m.receiverUsername, message: m.messages, datetime: m.dateTime}
                        ]);
                    });
                })
                .catch(err => {

                })
        }
    }

    const showIncomingCallModal = () => {
        setIsIncomingCallModalOpen(true);
    }
    const hideIncomingCallModal = () => {
        setIsIncomingCallModalOpen(false);
    }

    const allowNotification = () => {
        if (!("Notification" in window)) {
            console.log("Browser does not support desktop notification");
        } else {
            Notification.requestPermission();
        }
    }

    const checkUserStatus = async (receiverUserUsername) => {
        if (connection) {
            const isOnline = await connection.invoke("IsUserOnline", receiverUserUsername)
            setIsReceiverOnline(isOnline);
        }
    }

    // const handleAccptCall = () =>{
    //     if(connection){
    //         connection.invoke("CallAcepted",)
    //     }
    // }
    const handleSearch = () => {
        const results = users.filter(user => {
            const { username, fullname } = user;
            return (
                username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (fullname && fullname.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        });

        this.setState({ searchResults: results });
    };

    useEffect(() => {
        (async () => {
            await createConnection();
            await getAllUserByDepId();
            await getMessageOfPrivateChats();
            await savePublicKey();
            allowNotification();
        })();

    }, [userId]);

    return (
        <div className='col-md chat__container__width'>
            <div className='row mx-0'>
                {state?.showSettingComp ? <SettingComponent /> : (
                    <div className={`col-md-4 col-sm-12 users__lists__container overflow-auto ${isActive ? 'hide__on__mobile__device' : 'show__on__mobile__device'}`}>
                        <div className="users__lists p-4 ">
                            <div className="chat__logo__container">
                                <h4>Chats</h4>
                            </div>
                            <div className="my-3 search__container">
                                <form onSubmit={handleSearch} className="search__form__container" >
                                    <i className="fa-solid fa-magnifying-glass search__icon"></i>
                                    <input type="search" className="form-control search__form" placeholder="search user"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </form>
                            </div>
                            <div className="users" >
                                {users && users.length > 0 ? (
                                    !searchQuery ? (
                                        users.map((user, index) => {
                                            return (
                                                <a key={index} onClick={() => { setUserId(user.userId); setReceiverUsername(user.username); getMessageOfPrivateChats(); checkUserStatus(user.username); setIsActive(true) }}>
                                                    <div className="row user_design my-3">
                                                        <div className="col-auto">
                                                            <div className="user__image">
                                                                <img
                                                                    src={user?.profilePictureULR ? `${server}${user?.profilePictureULR}` : ChatImg}
                                                                    alt="user-image" />
                                                            </div>
                                                        </div>
                                                        <div className="col p-0 m-0">
                                                            <div className="user__info">
                                                                <h5 className="user__name">{user?.fullname ? user?.fullname : user?.username}</h5>
                                                                <span>{ }</span>
                                                                <span>{latestMessage?.senderUsername === user.username || latestMessage?.receiverUsername === user.username ? getTimeFromDateTime(latestMessage?.datetime) : getTimeFromDateTime(user?.lastMessageDateTime)}</span>
                                                            </div>
                                                            <div className="user__message">
                                                                <div className="line-clamp">
                                                                    {latestMessage?.senderUsername === user.username || latestMessage?.receiverUsername === user.username ? latestMessage.message : user?.lastMessage}
                                                                </div>
                                                                {/* <div className="badge">
                                                  <span></span>
                                              </div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            )
                                        })
                                    ) : (
                                        users.filter(item => {
                                            const lowercaseSearch = searchQuery?.toLowerCase();
                                            return (
                                                item.username.toLowerCase().includes(lowercaseSearch) ||
                                                (item.fullname &&
                                                    item.fullname.toLowerCase().includes(lowercaseSearch))
                                            );
                                        })
                                            .map((user, index) => {
                                                return (
                                                    <a key={index} onClick={() => { setUserId(user.userId); setReceiverUsername(user.username); getMessageOfPrivateChats(); checkUserStatus(user.username) }}>
                                                        <div className="row user_design my-3">
                                                            <div className="col-auto">
                                                                <div className="user__image">
                                                                    <img
                                                                        src={user?.profilePictureULR ? `${server}${user?.profilePictureULR}` : ChatImg}
                                                                        alt="user-image" />
                                                                </div>
                                                            </div>
                                                            <div className="col p-0 m-0">
                                                                <div className="user__info">
                                                                    <h5 className="user__name">{user?.fullname ? user?.fullname : user?.username}</h5>
                                                                    <span>12:01 AM</span>
                                                                </div>
                                                                <div className="user__message">
                                                                    <div className="line-clamp">
                                                                        {console.log(latestMessage)}
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
                                            })
                                    )
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}

                {userId ? <MessagesComponent isRejectCall={isRejectCall} id={userId} connection={connection} messages={messages} isReceiverOnline={isReceiverOnline} setIsActive={setIsActive} isActive={isActive} /> : null}
            </div>
            <audio id="messageSound">
                <source src={SoundMessage} type="audio/mpeg" />
            </audio>

            {/* {currentUserUsername == receiver &&
                <Modal show={isIncomingCallModalOpen} onHide={hideIncomingCallModal} className='incoming__call__component_modal'>
                    <Modal.Body className='my-2'>
                        <p>
                            {caller} is calling you.
                        </p>
                    </Modal.Body>
                    <Modal.Footer className='border-0 justify-content-center'>
                        <button type='button' className='btn btn-danger' onClick={() => {
                            hideIncomingCallModal();
                            setIsRejectCall(true);
                        }}
                        >Reject Call</button>
                        <button type='button' className='btn btn-success' onClick={() => {
                            handleAccptCall();
                        }}>Accept Call</button>
                    </Modal.Footer>
                </Modal>
            } */}

      { receiver===currentUserUsername && <VideoCall isInCall={isInCall} callerUsername={caller} receiverUsername={receiver} connection={connection}  />}
    
      {incomingCall && <VideoComp connection={connection}/>}
        </div>
    )
}

export default Chat
