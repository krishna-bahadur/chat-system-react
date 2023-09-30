import React from 'react'
import sodium from 'libsodium-wrappers'

const Encryption = async (message, connection,receiverUsername) => {
    debugger;
    await sodium.ready;
  const receiverPublicKey = await connection.invoke("GetKey", receiverUsername);;
  const privateKey = localStorage.getItem('privateKey');
  const nonce = localStorage.getItem('nonce');
  const ciphertext = sodium.crypto_secretbox_easy(message, nonce, receiverPublicKey, privateKey);
  const ciphertextBase64 = Buffer.from(ciphertext).toString('base64');
  console.log('Chipher Text : ' + ciphertextBase64);
  return ciphertextBase64;
}

export default Encryption
