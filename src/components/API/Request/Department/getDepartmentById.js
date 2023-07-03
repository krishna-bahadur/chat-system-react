import api from '../../api'
export const getDepartmentById = async (Id) =>{
    const response = await api.get('/Department/GetDepartmentById/'+Id);
    return response.data;
}