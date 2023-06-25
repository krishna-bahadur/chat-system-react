import api from '../../api'
export const getAllRoles = async () =>{
    const response = await api.get('/Authenticate/getRoles');
    return response.data;
}