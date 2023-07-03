import api from '../../api'
export const handleUserStatus =async (Id) => {
    const response = await api.get('/Authenticate/change-user-status?Id=' + Id)
    return response.data;
}