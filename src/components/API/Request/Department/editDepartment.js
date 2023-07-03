import api from '../../api'

export const editDepartment = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key)=>{
        formData.append(key, values[key]);
    })
    const response = await api.patch('/Department/UpdateDepartment', formData);
    return response.data;
}