import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ProjectAPI from "../api/ProjectAPI";
import { logoutAction } from "./userSlice";



export const getAllBoards = createAsyncThunk('boards/getAllBoards', async (args, { dispatch }) => {
    const { id, token } = args;
    try {
        const response = await ProjectAPI.getAll(token, id);
        console.log(response);
        return response;    
    } catch (err) {
        const { statusCode } = err.response.data;
        if(statusCode && statusCode === - 100) {
            dispatch(logoutAction());
        }
    }
});

export const createBoard = createAsyncThunk('boards/createBoard', async (args, { dispatch }) => {
    const { data, token } = args;
    try {
        const response = await ProjectAPI.createProject(token, data);
        return response;
    } catch (err) {
        const { statusCode } = err.response.data;
        if(statusCode && statusCode === - 100) {
            dispatch(logoutAction());
        }
    }
});

const initialState = {
    status: 'idle',
    data: [],
    error: null
};

export const getBoardsSelector = (state) => state.boards.data;

export const boardByIdSelector = (state, id) => state.boards.data.find(board => board._id === id);

export const boards = createSlice({
    name: 'boards',
    initialState: initialState,
    reducers: {
    },
    extraReducers: {
        [getAllBoards.pending]: (state, action) => {
            state.status = 'loading';
            return state;
        },
        [getAllBoards.fulfilled]: (state, action) => {
            state.status = 'complete';
            state.data = action.payload;
            return state;
        },
        [getAllBoards.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
            return state;
        },
    }
});


