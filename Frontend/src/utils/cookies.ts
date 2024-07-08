import cookies from 'js-cookie';

export const getToken = () => cookies.get('token');

export const setToken = (tokenValue: string) => cookies.set('token', tokenValue, { expires: 30 });

export const removeToken = () => cookies.remove('token');