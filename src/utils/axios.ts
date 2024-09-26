import axios from "axios";
//TODO: Refactor later
const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});
AxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
AxiosInstance.interceptors.response.use(
  (res) => {
    if (res.config.url?.includes("/auth/") && res.data.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
    }
    return res;
  },
  async (error) => {
    //Handle refresh token
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken'); 
        if(!refreshToken) return Promise.reject(error);

        const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/refresh', {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return AxiosInstance(originalRequest); 
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default AxiosInstance;
