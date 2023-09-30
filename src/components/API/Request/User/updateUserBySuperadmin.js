import api from '../../api'

export const updateUserBySuperadmin = async (values) =>{
    const response = await api.patch('/Authenticate/UpdateUserBySuperadmin', values);
    return response.data;
}

