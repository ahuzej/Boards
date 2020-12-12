import axios from 'axios';

const loginUser = (username, password) => {
    return new Promise((resolve, reject) => {
        axios.post('http://localhost:3001/auth/signIn', {
            username, password
        },{withCredentials: true, credentials: 'include'})
        .then((data) => {
            let { token, id } = data.data.data;
            let loginCredentials = {
                loggedIn: true,
                token,
                username,
                id
            };
            localStorage.setItem('auth', JSON.stringify(loginCredentials));
            resolve(loginCredentials);
        })
        .catch((error) => reject(error));
    });
}

const logoutUser = function() {
    if(localStorage.getItem('auth')) {
        localStorage.removeItem('auth');
        return true;
    }
    return false;
}

const getCurrentUser = function() {
    return localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : false;
}

export {
    loginUser,
    logoutUser,
    getCurrentUser
};