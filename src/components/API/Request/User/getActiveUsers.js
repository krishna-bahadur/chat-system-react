import api from '../../api'

export const getActiveUsers=async()=>{
    const response =await api.get('/Authenticate/get-active-users');
    return response.data;
}