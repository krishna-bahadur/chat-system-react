import api from '../../api'
export const createDepartment = async (values) =>{
   const formData=new FormData();
   Object.keys(values).forEach((key)=>{
    formData.append(key,values[key])
   })
    const response = await api.post("Department/CreateDepartment", formData)
    return response.data;
}