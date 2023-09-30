import React from 'react'

const GetRemotePublicKey = async (connection, username) => {
        var pKey = await connection.invoke("GetKey", username);
        localStorage.setItem("receiverPublicKey", pKey)
}

export default GetRemotePublicKey
