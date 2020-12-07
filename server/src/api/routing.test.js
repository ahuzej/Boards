const { createProtectedRoute } = require('./routing');
const { fetchToken, validateToken } = require("../core/middleware/tokenMiddleware");
var router = require('express').Router();

test('created protected route is valid', () => {
    let createdRoute = createProtectedRoute(router);
    expect(createdRoute).toEqual(expect.objectContaining({
        pre: expect.arrayContaining([fetchToken, validateToken]),
        post: expect.any(Array),
        router: expect.any(Function)
    }));
});