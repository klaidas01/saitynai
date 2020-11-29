import axios from 'axios';
import Cookies from 'js-cookie';

const { REACT_APP_API_URL } = process.env;

const axiosInstance = axios.create({
  baseURL: REACT_APP_API_URL ? REACT_APP_API_URL : 'https://localhost:44382/api/',
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.user && config.user.token) {
      try {
        const token = config.user.token;
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      } catch (e) {
        console.log(e);
      }
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.config || !error.config.user.token) return Promise.reject(error);
    const originalRequest = error.config;
    if (error.response.status === 401) {
      try {
        originalRequest.retry = true;
        const response = await axiosInstance.post('users/refresh', {
          accessToken: error.config.user.token,
          refreshToken: error.config.user.refreshToken,
        });
        Cookies.set('currentUser', response.data, { secure: true, sameSite: 'Strict' });
        error.config.setUser(response.data);
        originalRequest.user = response.data;
        return axiosInstance(originalRequest);
      } catch (e) {
        Cookies.remove('currentUser');
        error.config.setUser({ role: 'Guest' });
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
