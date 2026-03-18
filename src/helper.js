import secureLocalStorage from 'react-secure-storage';

export const setToken = (token) => {
    secureLocalStorage.setItem('token', token);
};

export const getToken = () => {
    return secureLocalStorage.getItem('token');
};

export const setRole = (role) => {
    secureLocalStorage.setItem('role', role);
};

export const getRole = () => {
    return secureLocalStorage.getItem('role');
};

export const clearStorage = () => {
    secureLocalStorage.clear();
};