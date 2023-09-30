import React, { useEffect, useRef, useState } from 'react'
import { getuserById } from '../API/Request/User/getUserById'
import ChatImg from '../../assets/dummy-user.jpg'
import { CiMenuKebab } from 'react-icons/ci'
import { BsSend } from 'react-icons/bs'
import { AiOutlinePaperClip } from 'react-icons/ai'
import { server } from '../API/domain'
import { MdKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import './Chat.css'
import { getTimeFromDateTime } from '../Functions/Functions'
import { FaVideo } from 'react-icons/fa'
import VideoCall from '../VideoCall/VideoCall'
import E2EE from '@chatereum/react-e2ee';
import VideoComp from '../VideoCall/VideoComp'
import { saveFile } from '../API/Request/Chat/saveFile'
import {BsDownload} from 'react-icons/bs'



const MessagesComponent = ({ isRejectCall, id, connection, messages, isReceiverOnline, setIsActive, isActive }) => {
  const [user, setUser] = useState();
  const [messageInput, setMessageInput] = useState('');
  const [receiverUsername, setReceiverUsername] = useState('');
  const currentUserUsername = localStorage.getItem('username');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  let depId = localStorage.getItem('depid');
  const messageContainerRef = useRef(null);
  const navigate = useNavigate();

  const [receiver, setReceiver] = useState('');
  const [caller, setCaller] = useState('');
  const [isFile, setIsFile] = useState(false);




  const getUserByUserId = async () => {
    getuserById(id)
      .then(data => {
        setUser(data);
        setReceiverUsername(data.username)
      }).catch(err => {
        console.log(err);
      })
  }


  const toggleVideoCall = async () => {
    setShowVideoCall(true);
  };

  connection?.on('IncomingCall', (caller, receiver) => {
    //showIncomingCallModal();
    setReceiver(receiver);
    setCaller(caller);
    setIsInCall(true);
  });

  useEffect(() => {
    getUserByUserId();
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [id, messages])



  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    try {
      const public_key = localStorage.getItem('publicKey');
      const encrypted = await E2EE.encrypt(public_key, messageInput);
      const encryptedCipher = JSON.stringify(encrypted);
      await connection.invoke('SendMessage', currentUserUsername, receiverUsername, encryptedCipher, messageInput, false);
      setMessageInput('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileInputChange = async (e) => {

    e.preventDefault();
    debugger;
    const selectedFile = e.target.files[0];
    try {
      const data = await saveFile(selectedFile, currentUserUsername, receiverUsername);
      if (data) {
        const public_key = localStorage.getItem('publicKey');
        const encrypted = await E2EE.encrypt(public_key, data);
        const encryptedCipher = JSON.stringify(encrypted);
        await connection.invoke('SendMessage', currentUserUsername, receiverUsername, encryptedCipher, data, true);
      }
    } catch (err) {
      if (err.response && err.response.status === 500) {
        console.log("Something went wrong..");
      } else {
        console.log("Server error....");
      }
    }
  };

  return (
    <div className={`col-md-8 col-sm-12 p-2 chat__container ${isActive ? 'show__on__mobile__device ' : 'hide__on__mobile__device'}`}>
      <div className='row mt-2 chat__content border-bottom py-3 mx-2'>
        <div className='col-md col-10 chat__top__header__section d-flex'>
          <img
            src={user?.profilePictureULR ? `${server}${user?.profilePictureULR}` : ChatImg}
            alt="user-image" />
          <div className='chat__user__name'>
            <div>
              <div className='username'>{user?.fullname ? user?.fullname : user?.username}</div>
              <div className='user__status'>{isReceiverOnline ? 'online' : 'offline'}</div>
            </div>
          </div>
        </div>
        <div className='col-md col d-flex justify-content-end menu__dot mx-0 px-0'>
          <button className='d-block mx-5 video__call__icon' title='Video Call' onClick={() => toggleVideoCall()}><FaVideo /> </button>
          <button onClick={() => setIsActive(false)} className='show__on__mobile__device d-none'><MdKeyboardBackspace /></button>
          <button className='hide__on__mobile__device d-block'><CiMenuKebab /> </button>

        </div>
      </div>
      <div ref={messageContainerRef} className='scroll__auto message-container mx-5 my-2'>
        {messages.map((m, index) => {
          if ((m.senderUsername === currentUserUsername && m.receiverUsername === receiverUsername) ||
            (m.senderUsername === receiverUsername && m.receiverUsername === currentUserUsername)) {
            return (
              <div key={index} className={currentUserUsername === m.senderUsername ? 'sent-message' : 'received-message'}>
                <div className={m.isFile ? 'file_message message' : 'message'}>
                  {m.isFile ? (
                    m.message.toLowerCase().endsWith('.pdf') || m.message.toLowerCase().endsWith('.doc') || m.message.toLowerCase().endsWith('.pptx') || m.message.toLowerCase().endsWith('.docx') ? (
                      <a className='download__file' href={`${server}${m.message}`} target="_blank" rel="noopener noreferrer" download>
                        <BsDownload /> {m.message.replace(/^Images\\/i, '')}
                      </a>
                    ) : m.message.toLowerCase().match(/\.(jpeg|jpg|png|gif|bmp)$/i) ? (
                      <img src={`${server}${m.message}`} alt="Image" className="chat__image" />
                    ) : (
                      null
                    )
                  ) : <p>{m.message}</p>}

                </div>
                {/* <div className='from-user'>
                  {m.senderUsername}
                </div> */}
                <div className='from-user'>
                  {getTimeFromDateTime(m.datetime)}
                </div>

              </div>
            );
          }
          else {
            return null;
          }
        })}
      </div>
      <div className='message__input__container px-5'>
        <form onSubmit={handleSendMessage} className='rounded-pill send_message_form px-2'>
          <div className='row align-middle'>
            <div className='col-md-auto col-auto'>
              <label htmlFor="fileInput" className='btn input__files border-0 pr-0'>
                <AiOutlinePaperClip />
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <div className='col-md col col-sm col-lg p-0 d-flex'>
              <textarea
                rows="1"
                placeholder='Type your message...'
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  setIsFile(true);
                }
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
            <div className='col-md-auto col-auto'>
              <button type='submit' className='btn btn-icon btn-success rounded-circle' disabled={!messageInput}>
                <BsSend />
              </button>
            </div>
          </div>
        </form>
      </div>

      {showVideoCall && <VideoComp connection={connection} />}
      {/* {showVideoCall  && <VideoCall isInCall={isInCall} callerUsername={currentUserUsername} receiverUsername={receiverUsername} connection={connection} />} */}
    </div>
  )
}

export default MessagesComponent
