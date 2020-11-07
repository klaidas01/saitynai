import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:44382/api/',
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const currentUser = Cookies.get('currentUser');
    if (currentUser) {
      try {
        const token = JSON.parse(currentUser).token;
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
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const currentUser = Cookies.get('currentUser');
      const response = await axiosInstance.post('users/refresh', {
        accesstoken: currentUser.token,
        refreshtoken: currentUser.refreshToken,
      });
      Cookies.set('currentUser', response.data, { secure: true });
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
