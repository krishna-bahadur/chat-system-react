import api from '../../api'
export const getAllUsers = async () => {
    const response =await api.get('/Authenticate/get-all-users');
    return response.data;
}