import { AxiosError } from "axios";

export function errorFromError(error: unknown) {
    if(error instanceof AxiosError) {
        return error.response?.data.error ? error.response?.data.error : "" + error;
    }
    return "" + error;
}