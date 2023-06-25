import api from '../../api'
export const userExists= async (value) =>{
    const response = await api.get('/Authenticate/check-username?username='+value);
    return response.data;
}