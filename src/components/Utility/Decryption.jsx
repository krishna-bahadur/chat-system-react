import React from 'react'
import sodium from 'libsodium-wrappers'

const Decryption = (cipherText, senderPublicKey) => {
  const privateKey = localStorage.getItem('privateKey'); 
  const nonce = localStorage.getItem('nonce');
  
  const decryptedMessage = sodium.crypto_secretbox_open_easy(cipherText, nonce, senderPublicKey, privateKey);
  console.log('Decryption : ' + decryptedMessage);
}

export default Decryption
