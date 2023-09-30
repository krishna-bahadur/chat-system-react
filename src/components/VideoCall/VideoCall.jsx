// import React, { useEffect, useRef, useState } from 'react'
// import { Modal } from 'react-bootstrap'
// import SimplePeer from 'simple-peer';

// const VideoCall = ({isInCall, callerUsername, receiverUsername, connection }) => {
//     const [isModalOpen, setIsModalOpen] = useState(true);
//     const localVideoRef = useRef(null);
//     const remoteVideoRef = useRef(null);
//     const peer = useRef(null);

//     useEffect(() => {
//         if (connection) {
          
//         }
//       }, [connection]);

//       const setupWebRTC = async () => {
//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//           setLocalStream(stream);
//           localVideoRef.current.srcObject = stream;
    
//           peerConnection.current = new RTCPeerConnection();
    
//           // Add local stream to peer connection
//           stream.getTracks().forEach((track) => {
//             peerConnection.current.addTrack(track, stream);
//           });
    
//           // Set up event handlers for the peer connection
//           peerConnection.current.onnegotiationneeded = handleNegotiationNeeded;
//           peerConnection.current.onicecandidate = handleICECandidate;
//           peerConnection.current.ontrack = handleTrack;
    
//           // Start call if it's not in progress
//           if (!callInProgress) {
//             startCall();
//           }
//         } catch (error) {
//           console.error('Error accessing camera/microphone:', error);
//         }
//       };
    
//       const startCall = async () => {
//         if (peerConnection.current && localStream) {
//           setCallInProgress(true);
    
//           // Create and send SDP offer to the other user
//           const offer = await peerConnection.current.createOffer();
//           await peerConnection.current.setLocalDescription(offer);
    
//           connection.invoke('SendOffer', offer);
//         }
//       };
    
//       const handleNegotiationNeeded = async () => {
//         if (peerConnection.current) {
//           const offer = await peerConnection.current.createOffer();
//           await peerConnection.current.setLocalDescription(offer);
    
//           connection.invoke('SendOffer', offer);
//         }
//       };
    
//       const handleICECandidate = (event) => {
//         if (event.candidate) {
//           connection.invoke('SendICECandidate', event.candidate);
//         }
//       };
    
//       const handleTrack = (event) => {
//         setRemoteStream(event.streams[0]);
//         remoteVideoRef.current.srcObject = event.streams[0];
//       };
    
//       const handleCallButton = () => {
//         if (!callInProgress) {
//           setupWebRTC();
//         }
//       };
    
//       const handleHangupButton = () => {
//         if (callInProgress) {
//           peerConnection.current.close();
//           setCallInProgress(false);
//           setLocalStream(null);
//           setRemoteStream(null);
//           localVideoRef.current.srcObject = null;
//           remoteVideoRef.current.srcObject = null;
//         }
//       };


   
//     return (
//         <div className='video__call__component'>
//             <Modal show={isModalOpen} className='video__call__component_modal'>
//                 <Modal.Body className='my-2'>
//                     <div className='row'>
//                         <div className='col-6 col-md-6 col-sm-6'>
//                             <video ref={localVideoRef} autoPlay playsInline />
//                         </div>
//                         <div className='col-6 col-md-6 col-sm-6 position-relative'>
//                             {remoteVideoRef.current === null ? (
//                                 <div>
//                                     <h3>Connecting....</h3>
//                                 </div>
//                             ) : (
//                                 <video ref={remoteVideoRef} autoPlay playsInline />
//                             )}
//                         </div>
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer className='border-0 justify-content-center'>
//                     <button type='button' className='btn btn-danger' onClick={() => { setIsModalOpen(false)}}>End Call</button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     )
// }

// export default VideoCall
