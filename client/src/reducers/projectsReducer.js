import { getAllProjects } from "../actions/projectsActions";

const { createReducer } = require("@reduxjs/toolkit");

const initialState = [];
export default createReducer(initialState, {
    [getAllProjects.fulfilled]: (state, action) => {
        state = action.payload;
        return state;
    },
    [getAllProjects.rejected]: (state, action) => {
        const { statusCode } = action.payload;
        switch(statusCode) {
            case -100:
                
                break;
            default:
                break;
        }
        return state;
    }
});