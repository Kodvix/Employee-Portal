

import axios from 'axios';

export const BASE_URL = 'https://192.168.1.32:8081/api';

export const myAxios = axios.create(({
    baseURL : BASE_URL,
}))