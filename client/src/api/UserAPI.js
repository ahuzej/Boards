import axios from 'axios';
import ProjectPlannerAPI from './ProjectPlannerAPI';

var UserAPI = function () {
    this.url = 'http://localhost:3001/users/';
}
UserAPI.prototype = ProjectPlannerAPI;
UserAPI.prototype.getAll = async function getAll(token, id) {
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
UserAPI.prototype.getContacts = async function getContacts(token, id) {
    let response = [];
    let config = {
        headers: {
            'Authorization': `Token ${token}`
        }
    };
    response = await axios.get(`${this.url}${id}/contacts`,  config);
    response = response['data']['data'];

    return response;
}
export default new UserAPI();