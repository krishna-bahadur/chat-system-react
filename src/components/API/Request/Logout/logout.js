import api from '../../api'

export const logout= async () =>{
    const response = await api.get('/Authenticate/logout');
    return response.data;
}