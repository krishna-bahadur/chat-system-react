import api from '../../api'
export const changePassword = async (values) => {
    const response = await api.post('/Authenticate/ChangePassword', values)
    return response.data;
}