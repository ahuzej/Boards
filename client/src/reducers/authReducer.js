import { getContacts, loginAction } from "../actions/authActions";
import { logoutAction } from "../actions/authActions";

const { createReducer } = require("@reduxjs/toolkit");

const initialState = {};
export default createReducer(initialState, {
    [loginAction.fulfilled]: (state, action) => {
        state = action.payload;
        return state;
    },
    [logoutAction]: (state, action) => {
        console.log('HEREHRHERE')
        state = {};
        return state;
    },
    [getContacts.fulfilled]: (state, action) => {
        return Object.assign(state, action.payload);
    }
});