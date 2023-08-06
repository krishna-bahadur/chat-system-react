import api from '../../api'
export const updateUser = async (values) => {
    const formData=new FormData();
    Object.keys(values).forEach((key)=>{
     formData.append(key,values[key])
    })
    const response = await api.patch('/Authenticate/UpdateUser', formData);
    return response.data;
}