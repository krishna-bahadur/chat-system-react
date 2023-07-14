import api from '../../api'
export const getuserById = async (UserId) => {
    const response = await api.get('/Authenticate/GetUserById/' + UserId)
    return response.data;
}