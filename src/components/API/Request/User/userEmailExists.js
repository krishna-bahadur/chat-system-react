import api from '../../api'

export const userEmailExists = async (value) =>{
    const response = await api.get('/Authenticate/check-email?email='+value)
    return response.data;
}