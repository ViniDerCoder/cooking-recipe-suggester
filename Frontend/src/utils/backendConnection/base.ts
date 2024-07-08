import axios, { AxiosResponse } from 'axios';

const baseUrl = 'http://localhost:3001/api';

export abstract class BackendConnection {
    static async get(url: string, param: string | undefined, body: any | undefined, authorization: string | undefined) {
        const response = await axios.get(`${baseUrl}/${url}` + (param ? `/${param}` : ``), { data: body , headers: { Authorization: authorization } });
        return BackendConnection.returnResponse(response);
    }

    static async post(url: string, param: string | undefined, body: any | undefined, authorization: string | undefined) {
        const response = await axios.post(`${baseUrl}/${url}` + (param ? `/${param}` : ``), body, { headers: { Authorization: authorization } });
        return BackendConnection.returnResponse(response);
    }

    static async put(url: string, param: string | undefined, body: any | undefined, authorization: string | undefined) {
        const response = await axios.put(`${baseUrl}/${url}` + (param ? `/${param}` : ``), body, { headers: { Authorization: authorization } });
        return BackendConnection.returnResponse(response);
    }

    static async delete(url: string, param: string | undefined, body: any | undefined, authorization: string | undefined) {
        const response = await axios.delete(`${baseUrl}/${url}` + (param ? `/${param}` : ``), { data: body, headers: { Authorization: authorization } });
        return BackendConnection.returnResponse(response);
    }

    
    private static returnResponse(response: AxiosResponse<any, any>) {
        if(response.status !== 200) throw new Error(response.data.error);
        else return response.data;
    }
}
