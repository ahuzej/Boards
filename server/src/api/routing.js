const { fetchToken, validateToken } = require( "../core/middleware/tokenMiddleware");
const { initiateRequestProcess, finalizeRequestProcess, sendResponse } = require("../core/middleware/baseMiddleware");

function exportRoute(routeObject) {
    return [
        ...routeObject.pre,
        routeObject.router,
        ...routeObject.post
    ];
}

function createBaseRoute(router) {
    return {
        router,
        pre: [
            initiateRequestProcess
        ],
        post: [
            finalizeRequestProcess,
            sendResponse
        ]
    };
}

function createProtectedRoute(router) {
    let { pre, ...baseRoute} = createBaseRoute(router);
    return {
        ...baseRoute,
        pre: [
            ...pre,
            fetchToken,
            validateToken
        ]
    };
}


module.exports = {
    createBaseRoute,
    createProtectedRoute,
    exportRoute
};