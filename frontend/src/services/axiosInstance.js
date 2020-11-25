import axios from 'axios';
import Cookies from 'js-cookie';

const { REACT_APP_API_URL } = process.env;

const axiosInstance = axios.create({
  baseURL: REACT_APP_API_URL ? REACT_APP_API_URL : 'https://localhost:44382/api/',
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
          'Content-Type': 'application/json',
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
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      try {
        const currentUser = JSON.parse(Cookies.get('currentUser'));
        const response = await axiosInstance.post('users/refresh', {
          accessToken: currentUser.token,
          refreshToken: currentUser.refreshToken,
        });
        Cookies.set('currentUser', response.data, { secure: true });
      } catch (e) {
        return Promise.reject(error);
      }
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
