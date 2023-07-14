import api from '../../api'
export const getAllUsers = async (param) => {
    const response =await api.get('/Authenticate/get-all-users/'+ param);
    return response.data;
}