import api from '../../api'
export const handleUserStatus =async (UserId) => {
    const response = await api.get('/Authenticate/change-user-status/' + UserId)
    return response.data;
}