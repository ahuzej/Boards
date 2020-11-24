function ProjectPlannerAPI() {
    this._statusCodes = {
        'EXPIRED_TOKEN': -100
    };
}
ProjectPlannerAPI.prototype.hasTokenExpired = function (err) {
    if (err.response) {
        const { data } = err.response;
        if (data && data['statusCode'] === this._statusCodes['EXPIRED_TOKEN']) {
            return true;
        }
    }
    return undefined;
}

export default new ProjectPlannerAPI();