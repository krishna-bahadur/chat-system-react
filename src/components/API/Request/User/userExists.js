import api from '../../api'
export const userExists= async (username) =>{
    const response = await api.get('/Authenticate/check-username/'+username);
    return response.data;
}