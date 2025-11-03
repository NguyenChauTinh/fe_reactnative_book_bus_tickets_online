import axios from 'axios';

const createApiManager = (baseURL) => {
    const axiosInstance = axios.create({
        baseURL,
        withCredentials: true,
        responseType: 'json',
    });

    const request = async (method, url, data = null, params = null, customHeaders = {}) => {
        try {
            const response = await axiosInstance({
                method,
                url,
                data: data === null ? undefined : data,
                params,
                headers: {
                    ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
                    ...customHeaders,
                },
            });

            return response.data;
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    };

    return {
        get: (url, { params, headers } = {}) => request('get', url, null, params, headers),
        post: (url, data, headers = {}) => request('post', url, data, null, headers),
        put: (url, data, headers = {}) => request('put', url, data, null, headers),
        delete: (url) => request('delete', url),
        patch: (url, data, headers = {}) => request('patch', url, data, null, headers),
    };
};

export default createApiManager;