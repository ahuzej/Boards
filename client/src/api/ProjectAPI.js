import axios from 'axios';
import ProjectPlannerAPI from './ProjectPlannerAPI';

let ProjectAPI = function () {
    this.url = 'http://localhost:3001/boards/';
}
ProjectAPI.prototype = ProjectPlannerAPI;
ProjectAPI.prototype.getAll = async function (token, id) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    response = await axios.get(`${this.url}user/${id}`, config);
    response = response['data']['data'];
    return response;
}
ProjectAPI.prototype.getPeople = async function (token, id) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    response = await axios.get(`${this.url}${id}/people`, config);
    response = response['data']['data']['users'];
    return response;
}
ProjectAPI.prototype.getById = async function (token, id) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    response = await axios.get(`${this.url}${id}`, config);
    response = response['data']['data'];
    return response;
}
ProjectAPI.prototype.getThreads = async function (token, boardId) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
    
    response = await axios.get(`${this.url}${boardId}/threads`, config);
    console.log(response.data.data);
    response = response['data']['data']['threads'];
    return response;
}
ProjectAPI.prototype.getThread = async function (token, threadId) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };

    response = await axios.get(`http://localhost:3001/threads/${threadId}`, config);
    response = response['data']['data'];
    return response;
}
ProjectAPI.prototype.createProject = async function (token, data) {
    let response = null;
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
    response = await axios.post(`${this.url}`, data, config);
    response = data['data'];

    return response;
}
ProjectAPI.prototype.createThread = async function (token, data) {
    let response = null;
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
    response = await axios.post(`${this.url}${data.boardId}/threads/create`, data, config);
    response = response['data']['data'];

    return response;
}
ProjectAPI.prototype.createComment = async function (token, threadId, data) {
    let response = null;
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
    response = await axios.post(`http://localhost:3001/threads/${threadId}/comments/create`, data, config);
    response = response['data']['data'];

    return response;
}
export default new ProjectAPI();