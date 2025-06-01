

import axios from 'axios';

export const BASE_URL = 'https://localhost:8081/api';

export const myAxios = axios.create(({
    baseURL : BASE_URL,
}))