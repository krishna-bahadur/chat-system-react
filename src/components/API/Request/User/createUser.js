import api from '../../api'
export const createUser = async (values) => {
    const response = await api.post("/Authenticate/create-user", values);
    return response.data;
}