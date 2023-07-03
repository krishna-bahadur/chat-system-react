import api from '../../api'
export const getuserById = async (Id) => {
    const response = await api.get('/Authenticate/GetUserById/' + Id)
    return response.data;
}