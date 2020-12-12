import axios from 'axios';
import ProjectPlannerAPI from './ProjectPlannerAPI';

function createGetUrl(url, params) {
    let paramKeys = Object.keys(params);
    let first = true;
    let delimiter = '?';
    for(let i=0; i < paramKeys.length; i++) {
        let key = paramKeys[i];
        let value = params[key];
        if(value) {
            url = `${url}${delimiter}${key}=${value}`;
            if(first) {
                first = false;
                delimiter = '&';
            }
        }
    }
    return url;
}

const ProjectAPI = function () {
    this.url = 'http://localhost:3001/';
}
ProjectAPI.prototype = ProjectPlannerAPI;
ProjectAPI.prototype.registerUser = async function (username, password, email) {
    let response = [];

    response = await axios.post(`${this.url}auth/signUp`, { username, password, email});
    response = response.data.data;
    return response;
}
ProjectAPI.prototype.loginUser = async function (username, password) {
    let response = [];

    response = await axios.post(`${this.url}auth/signIn`, { username, password});
    response = response.data.data;
    return response;
}
ProjectAPI.prototype.getAll = async function (token, id) {
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
ProjectAPI.prototype.getPeople = async function (token, id) {
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
ProjectAPI.prototype.getUsers = async function (token, username, boardId) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    let url = createGetUrl(`${this.url}users`, {username, boardId});
    response = await axios.get(url, config);
    response = response.data.data;
    
    return response;
}
ProjectAPI.prototype.getById = async function (token, id) {
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
ProjectAPI.prototype.getThreads = async function (token, boardId) {
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
ProjectAPI.prototype.getComments = async function (token, threadId) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
    
    response = await axios.get(`${this.url}threads/${threadId}/comments`, config);
    response = response.data.data;
    console.log(response);
    return response;
}

ProjectAPI.prototype.getThread = async function (token, threadId) {
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
ProjectAPI.prototype.createThread = async function (token, data) {
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
ProjectAPI.prototype.createBoard = async function (token, data) {
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
ProjectAPI.prototype.createComment = async function (token, threadId, data) {
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
ProjectAPI.prototype.createRating = async function (token, data) {
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
ProjectAPI.prototype.addUsersToBoard = async function (token, boardId, data) {
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
export default new ProjectAPI();