import api from '../../api'
export const getPrivateChatMessages = async (senderusername, receiverusername) =>{
    const response = await api.get('/Message/GetMessageOfPrivateChat/'+senderusername+'/'+receiverusername);
    return response.data;
}