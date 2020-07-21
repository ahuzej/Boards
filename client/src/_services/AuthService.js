import axios from 'axios';

const loginUser = (username, password) => {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:3001/authentication', {
            username, password
        },{withCredentials: true, credentials: 'include'})
        .then((data) => {
            localStorage.setItem('auth', data);
            resolve(data);
        })
        .catch((error) => reject(error));
    });
}

const logoutUser = function() {
    console.log('Entered logoutUser');
    if(localStorage.getItem('auth')) {
        localStorage.removeItem('auth');
        return true;
    }
    return false;
}

const getCurrentUser = function() {
    return localStorage.getItem('auth');
}

export default {
    loginUser,
    logoutUser,
    getCurrentUser
}