import api from '../../api'
export const saveFile = async (file, senderUsername,receiverUsername) =>{
    debugger;
   const formData=new FormData();
   formData.append('File', file);
    formData.append('SenderUsername', senderUsername);
    formData.append('Receiverusername', receiverUsername);
    const response = await api.post("Message/SaveFile", formData);
    return response.data;
}
