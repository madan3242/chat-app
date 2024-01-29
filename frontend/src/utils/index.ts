import { AxiosResponse } from "axios";

export interface ApiResponseInterface {
    data: any,
    message: string,
    statusCode: number,
    success: boolean
}

export const requestHandler =async (
    api: () => Promise<AxiosResponse<ApiResponseInterface,any>>,
    setLoading: ((loading: boolean) => void) | null,
    onSuccess: (data: ApiResponseInterface) => void,
    onError: (error: string) => void
) => {
    // Show loading state if setLoading function is provided
    setLoading && setLoading(true);
    try {
        // Make the API request
        const response = await api();
        const { data } = response;
        if (data?.success) {
            // Call the onSuccess callback with the response data
            onSuccess(data);
        }
    } catch (error: any) {
        //Handle error cases, including unauthorized and forbidden cases
        if ([401, 403].includes(error?.response.data?.statusCode)) {
            localStorage.clear();
            if (isBrowser) window.location.href = "/login";
        }
        onError(error?.response.data?.message || "Something went wrong");
    } finally {
        setLoading && setLoading(false);
    }
}

export const isBrowser = typeof window !== "undefined";

export class LocalStorage {
    static get(key: string){
        if(!isBrowser) return;
        const value = localStorage.getItem(key);
        if (value) {
            try {
                return JSON.parse(value);
            } catch (error) {
                return null;
            }
        }
        return null;
    }
}