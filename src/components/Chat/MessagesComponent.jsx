import React, { useEffect, useRef, useState } from 'react'
import { getuserById } from '../API/Request/User/getUserById'
import ChatImg from '../../assets/dummy-user.jpg'
import { CiMenuKebab } from 'react-icons/ci'
import { BsSend } from 'react-icons/bs'
import { AiOutlinePaperClip } from 'react-icons/ai'
import domain from '../API/domainAPI'


const MessagesComponent = ({id, connection, messages, isReceiverOnline}) => {
  const [user, setUser] = useState();
  const [messageInput, setMessageInput] = useState('');
  const [receiverUsername, setReceiverUsername] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  console.log(isReceiverOnline);

  const currentUserUsername = localStorage.getItem('username');
  let depId = localStorage.getItem('depid');
  const messageContainerRef = useRef(null);

  const getUserByUserId = async () => {
    getuserById(id)
      .then(data => {
        setUser(data);
        setReceiverUsername(data.username)
      }).catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    getUserByUserId();
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [id, messages])

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    try {
      
      await connection.invoke('SendMessage', currentUserUsername, receiverUsername, messageInput);
      setMessageInput('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='row mt-2 chat__content border-bottom py-3 mx-2'>
        <div className='col-md chat__top__header__section d-flex'>
          <img 
           src={user?.profilePictureULR ? `${domain}${user?.profilePictureULR}` : ChatImg}
           alt="user-image" />
          <div className='chat__user__name'>
            <div>
              <div className='username'>{user?.username}</div>
              <div className='user__status'>{isReceiverOnline ? 'online' : 'offline'}</div>
            </div>
          </div>
        </div>
        <div className='col-md d-flex justify-content-end menu__dot'>
          <CiMenuKebab />
        </div>
      </div>
      <div ref={messageContainerRef} className='scroll__auto message-container mx-5 my-2'>
        {messages.map((m, index) => {
         if ((m.senderUsername === currentUserUsername && m.receiverUsername === receiverUsername) ||
         (m.senderUsername === receiverUsername && m.receiverUsername === currentUserUsername)) {
            return (
              <div key={index} className={currentUserUsername === m.senderUsername ? 'sent-message' : 'received-message'}>
                <div className='message'>
                  <p>{m.message}</p>
                </div>
                <div className='from-user'>{m.senderUsername}</div>
              </div>
            );
          }
          else {
            return null; 
          }
        })}
      </div>
      <div className='message__input__container'>
        <form onSubmit={handleSendMessage} className='rounded-pill send_message_form px-2'>
          <div className='row align-middle'>
            <div className='col-md-auto'>
              <button className='btn input__files border-0 pr-0' disabled>
                <AiOutlinePaperClip />
              </button>
            </div>
            <div className='col-md col-sm col-lg p-0 d-flex'>
              <textarea
                rows="1"
                placeholder='Type your message...'
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSendMessage(e); // Call your submit function here
                  }
                }}
              />
            </div>
            <div className='col-md-auto'>
              <button type='submit' className='btn btn-icon btn-success rounded-circle' disabled={!messageInput}>
                <BsSend />
              </button>
            </div>
          </div>
        </form>
      </div>



    </>
  )
}

export default MessagesComponent
