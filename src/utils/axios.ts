import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
import router from '@/router';

// Set the base URL for all requests
const request= axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,  // Timeout after 10 seconds
});

// Add request interceptor
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    //put token inside the header for request
    if(userStore.token){
      config.headers.token = userStore.token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
request.interceptors.response.use(
  (response) => {
    const status = response.data.status
    if(status){
      ElMessage({
        type:'error',
        message: 'Token expired or invalid. Please log in again.'
      })
      router.push({ name: 'login' })
    }
    return response.data;  // Return only the data to simplify usage
  },
  (error) => {
    // Handle error response globally (e.g., show error message)
    let msg: string = '';
    let status: number = error.response?.status || 0; // Use optional chaining for safety

    switch (status) {
        case 400:
            msg = 'Bad Request: The server could not understand the request.';
            break;
        case 401:
            msg = 'Unauthorized: Token expired or invalid. Please log in again.';
            // Optionally trigger a logout or redirect to login
            break;
        case 403:
            msg = 'Forbidden: You do not have permission to access this resource.';
            break;
        case 404:
            msg = 'Not Found: The requested resource could not be found.';
            break;
        case 500:
            msg = 'Internal Server Error: An error occurred on the server.';
            break;
        case 502:
            msg = 'Bad Gateway: Received an invalid response from the upstream server.';
            break;
        case 503:
            msg = 'Service Unavailable: The server is currently unavailable.';
            break;
        case 504:
            msg = 'Gateway Timeout: The server took too long to respond.';
            break;
        default:
            msg = 'An unexpected error occurred. Please try again later.';
            break;
    }
    ElMessage({
        type:'error',
        message: msg
    })

    return Promise.reject(error);  // Reject the promise so the error can be handled later
    }
);

export default request;