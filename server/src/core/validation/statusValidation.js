function isStatusOk(status) {
    return status >= 200 && status < 300 ? true : false;
}

module.exports = {
    isStatusOk
};