import api from '../../api'

export const userEmailExists = async (email) =>{
    const response = await api.get('/Authenticate/check-email/'+email)
    return response.data;
}