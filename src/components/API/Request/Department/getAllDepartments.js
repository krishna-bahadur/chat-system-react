import api from '../../api'
export const getAllDepartment = async () =>{
    const response = await api.get("/Department/GetAllDepartments");
    return response.data;
}