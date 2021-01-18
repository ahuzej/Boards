
/**
 * Prepares JSON for printing purposes, and also hides sensitive data from being logged. 
 */
function displayJsonWithoutSensitiveData(data) {
    let mutated = {...data};
    if(mutated.password) {
        delete mutated.password;
    }
    return JSON.stringify(mutated);
}

module.exports = {
    displayJsonWithoutSensitiveData
}