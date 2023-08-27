import api from '../../api'
export const getUserByDepId = async (depId) => {
    // const response = await api.get('/Authenticate/get-users-by-departmentId/'+ depId);
    const response = await api.get('/Authenticate/GetUsersByChatTimestamp/'+ depId);
    return response.data;
}