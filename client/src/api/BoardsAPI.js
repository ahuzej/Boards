import axios from 'axios';

function createGetUrl(url, params) {
    let paramKeys = Object.keys(params);
    let first = true;
    let delimiter = '?';
    for (let i = 0; i < paramKeys.length; i++) {
        let key = paramKeys[i];
        let value = params[key];
        if (value) {
            url = `${url}${delimiter}${key}=${value}`;
            if (first) {
                first = false;
                delimiter = '&';
            }
        }
    }
    return url;
}

const BoardsAPI = function () {
    this.url = process.env.REACT_APP_API_URL;
}
BoardsAPI.prototype.registerUser = async function (username, password, email) {
    let response = [];

    response = await axios.post(`${this.url}auth/signUp`, { username, password, email });
    response = response.data.data;
    return response;
}
BoardsAPI.prototype.uploadAvatar = async function (token, id, avatarImg) {
    let response = null;
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    const formData = new FormData();
    console.log('HEHREHREH')

    formData.append('avatarImg', avatarImg, 'test.png');
    console.log('HEHREHREH')
    response = await axios.put(`${this.url}users/${id}/uploadAvatar`, formData, config);
    response = response.data.data;
    return response;
}
BoardsAPI.prototype.loginUser = async function (username, password) {
    let response = [];

    response = await axios.post(`${this.url}auth/signIn`, { username, password });
    response = response.data.data;
    return response;
}
BoardsAPI.prototype.getAll = async function (token, id) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    response = await axios.get(`${this.url}boards/user/${id}`, config);
    response = response.data.data;
    return response;
}
BoardsAPI.prototype.getPeople = async function (token, id) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    response = await axios.get(`${this.url}boards/${id}/people`, config);
    response = response.data.data.users;
    return response;
}
BoardsAPI.prototype.getUsers = async function (token, username, boardId) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    let url = createGetUrl(`${this.url}users`, { username, boardId });
    response = await axios.get(url, config);
    response = response.data.data;

    return response;
}
BoardsAPI.prototype.getUserById = async function (token, id) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    let url = `${this.url}users/${id}`;
    response = await axios.get(url, config);
    response = response.data.data;

    return response;
}
BoardsAPI.prototype.fetchProfileById = async function (token, id) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    let url = `${this.url}users/${id}/profile`;
    response = await axios.get(url, config);
    response = response.data.data;

    return response;
}
BoardsAPI.prototype.getById = async function (token, id) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    response = await axios.get(`${this.url}boards/${id}`, config);
    response = response.data.data;

    return response;
}
BoardsAPI.prototype.getThreads = async function (token, boardId) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    response = await axios.get(`${this.url}boards/${boardId}/threads`, config);
    response = response.data.data;

    return response;
}
BoardsAPI.prototype.getComments = async function (token, threadId) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    response = await axios.get(`${this.url}threads/${threadId}/comments`, config);
    response = response.data.data;
    return response;
}

BoardsAPI.prototype.getThread = async function (token, threadId) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    response = await axios.get(`${this.url}threads/${threadId}`, config);
    response = response.data.data;

    return response;
}
BoardsAPI.prototype.createThread = async function (token, data) {
    let response = null;
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
    response = await axios.post(`${this.url}threads/`, data, config);
    response = response.data.data;

    return response;
}
BoardsAPI.prototype.createBoard = async function (token, data) {
    let response = null;
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
    response = await axios.post(`${this.url}boards`, data, config);
    response = response.data.data;

    return response;
}
BoardsAPI.prototype.createComment = async function (token, threadId, data) {
    let response = null;
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
    response = await axios.post(`${this.url}threads/${threadId}/comments/create`, data, config);
    response = response.data.data;

    return response;
}
BoardsAPI.prototype.createRating = async function (token, data) {
    let response = null;
    let threadId = data.thread;
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
    response = await axios.post(`${this.url}threads/${threadId}/comments/rate`, data, config);
    response = response.data.data;

    return response;
}
BoardsAPI.prototype.addUsersToBoard = async function (token, boardId, data) {
    let response = null;
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
    response = await axios.post(`${this.url}boards/${boardId}/addUser`, data, config);
    response = response.data.data;

    return response;
}
BoardsAPI.prototype.updateThreadLock = async function (token, threadId, locked) {
    let response = null;
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
    response = await axios.post(`${this.url}threads/${threadId}/changeThreadState`, { locked }, config);
    response = response.data.data;

    return response;
}
BoardsAPI.prototype.updateThreadSticky = async function (token, threadId, sticky) {
    let response = null;
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
    response = await axios.post(`${this.url}threads/${threadId}/changeThreadState`, { sticky }, config);
    console.log(response);
    response = response.data.data;

    return response;
}

export default new BoardsAPI();