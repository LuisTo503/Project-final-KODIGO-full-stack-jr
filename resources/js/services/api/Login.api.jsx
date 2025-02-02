import { AxiosRouter } from "../utils/Axios.utis";



export const LoginApi = async (data) => {
    try {
        const response = await AxiosRouter.post("/api/login", data);
        console.log(response.data);
        
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}