import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';

const VideoComp = ({ connection }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    (async () => {
        setupWebRTC();
       // Notify the other user to start streaming
       await connection.invoke('StartVideoChat')

})();
  }, []);

  const setupWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      localVideoRef.current.srcObject = stream;

      const peerConnection = new RTCPeerConnection();
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const offerString = JSON.stringify(offer);
      await connection.invoke('SendOffer', offerString);

      connection.on('ReceiveOffer', async (offerString) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(offerString)));

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        const answerString = JSON.stringify(answer);
        connection.invoke('SendAnswer', answerString);
      });

      connection.on('ReceiveAnswer', async (answerString) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(answerString)));
      });
    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
    }
  };

  return (
    <div className='video__call__component'>
      <Modal show={isModalOpen} className='video__call__component_modal'>
        <Modal.Body className='my-2'>
          <div className='row'>
            <div className='col-md'>
              <video className='local' ref={localVideoRef} autoPlay playsInline />
            </div>
            <div className='col-md'>
              <video className='remote' ref={remoteVideoRef} autoPlay playsInline />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className='border-0 justify-content-center'>
                    <button type='button' className='btn btn-danger' onClick={() => { setIsModalOpen(false)}}>End Call</button>
                 </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VideoComp;
