import React, { useEffect, useState } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatImg from '../../assets/user.jpg'

const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [receiverUsername, setReceiverUsername] = useState('');
    const [isSentMessage, setIsSentMessage] = useState(false);

    const senderUsername = localStorage.getItem('username');

    useEffect(() => {
        const createConnection = async () => {
            const token = localStorage.getItem('token');
            const connection = new HubConnectionBuilder()
                .withUrl("https://localhost:7183/hamrochathub",{
                    accessTokenFactory: () => token,
                })
                .configureLogging(LogLevel.Information)
                .build();

            connection.on('ReceiveMessage', (senderUsername, receiverUsername, message) => {
                setIsSentMessage(receiverUsername === senderUsername);
                setMessages(messages => [...messages, { senderUsername, message }])
            });

              
            try {
                await connection.start();
                console.log('Connection established...');
            } catch (error) {
                console.error('Error starting connection:', error);
            }

            setConnection(connection);
        };
        createConnection();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !receiverUsername.trim()) return;

        try {
            setIsSentMessage(true);
            // Invoke the SendMessage method on the backend with the sender's and receiver's usernames and the message content
            await connection.invoke('SendMessage', senderUsername, receiverUsername, messageInput);
            setMessageInput('');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='col-md'>
            <div className='row'>
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
                        <div className="users mt-5">
                            <a href="">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="user__image">
                                            <img src={ChatImg} alt="user-image" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="user__info">
                                            <h5 className="user__name">Suman Rai</h5>
                                            <span>12:01 AM</span>
                                        </div>
                                        <div className="user__message">
                                            <div className="line-clamp">
                                                Hello! Yeah, I'm going to meet my friend of mine at the departments stores now.
                                            </div>
                                            <div className="badge">
                                                <span>3</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="users mt-5">
                            <a href="">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="user__image">
                                            <img src={ChatImg} alt="user-image" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="user__info">
                                            <h5 className="user__name">Suman Rai</h5>
                                            <span>12:01 AM</span>
                                        </div>
                                        <div className="user__message">
                                            <div className="line-clamp">
                                                Hello! Yeah, I'm going to meet my friend of mine at the departments stores now.
                                            </div>
                                            <div className="badge">
                                                <span>3</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="users mt-5">
                            <a href="">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="user__image">
                                            <img src={ChatImg} alt="user-image" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="user__info">
                                            <h5 className="user__name">Suman Rai</h5>
                                            <span>12:01 AM</span>
                                        </div>
                                        <div className="user__message">
                                            <div className="line-clamp">
                                                Hello! Yeah, I'm going to meet my friend of mine at the departments stores now.
                                            </div>
                                            <div className="badge">
                                                <span>3</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="users mt-5">
                            <a href="">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="user__image">
                                            <img src={ChatImg} alt="user-image" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="user__info">
                                            <h5 className="user__name">Suman Rai</h5>
                                            <span>12:01 AM</span>
                                        </div>
                                        <div className="user__message">
                                            <div className="line-clamp">
                                                Hello! Yeah, I'm going to meet my friend of mine at the departments stores now.
                                            </div>
                                            <div className="badge">
                                                <span>3</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="users mt-5">
                            <a href="">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="user__image">
                                            <img src={ChatImg} alt="user-image" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="user__info">
                                            <h5 className="user__name">Suman Rai</h5>
                                            <span>12:01 AM</span>
                                        </div>
                                        <div className="user__message">
                                            <div className="line-clamp">
                                                Hello! Yeah, I'm going to meet my friend of mine at the departments stores now.
                                            </div>
                                            <div className="badge">
                                                <span>3</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="users mt-5">
                            <a href="">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="user__image">
                                            <img src={ChatImg} alt="user-image" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="user__info">
                                            <h5 className="user__name">Suman Rai</h5>
                                            <span>12:01 AM</span>
                                        </div>
                                        <div className="user__message">
                                            <div className="line-clamp">
                                                Hello! Yeah, I'm going to meet my friend of mine at the departments stores now.
                                            </div>
                                            <div className="badge">
                                                <span>3</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="users mt-5">
                            <a href="">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="user__image">
                                            <img src={ChatImg} alt="user-image" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="user__info">
                                            <h5 className="user__name">Suman Rai</h5>
                                            <span>12:01 AM</span>
                                        </div>
                                        <div className="user__message">
                                            <div className="line-clamp">
                                                Hello! Yeah, I'm going to meet my friend of mine at the departments stores now.
                                            </div>
                                            <div className="badge">
                                                <span>3</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-md-7 p-2 chat__container">
                    <div className='row mt-2 chat__content border-bottom py-3 mx-2'>
                        <div className='col-md chat__top__header__section d-flex'>
                            <img src={ChatImg} alt="user-image" />
                            <div className='chat__user__name'>
                                <div>
                                    <div className='username'>Suman Rai</div>
                                    <div className='user__status'>online</div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md'>

                        </div>
                    </div>
                    <div className='scroll__auto message-container mx-5'>
                        {messages.map((m, index) => (
                            <div
                                key={index}
                                className={`user-message ${m.senderUsername === senderUsername ? 'sent-message' : 'received-message'}`}
                            >
                                <div className='message'>{m.message}</div>
                                <div className='from-user'>{m.senderUsername}</div>
                            </div>
                        ))}
                    </div>
                    <div className='position-relative'>
                        <form onSubmit={handleSendMessage} className='sendMessageForm'>
                            <input type="text" value={receiverUsername} placeholder="Receiver Username" onChange={(e) => setReceiverUsername(e.target.value)} className='form-control border my-3' />
                            <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} className='form-control  border my-3' />
                            <button className='btn btn-primary' type="submit">Send</button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Chat
