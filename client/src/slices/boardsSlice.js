import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BoardsAPI from "../api/BoardsAPI";
import { logoutAction } from "./userSlice";



export const getAllBoards = createAsyncThunk('boards/getAllBoards', async (args, { dispatch, getState }) => {
    try {
        const user = getState().user.data;
        const response = await BoardsAPI.getAll(user.token, user.id);
        return response;
    } catch (err) {
        const { statusCode } = err.response.data;
        if (statusCode && statusCode === - 100) {
            dispatch(logoutAction());
        } else {
            throw new Error('Request failed.');
        }
    }
});

export const createBoard = createAsyncThunk('boards/createBoard', async (args, { dispatch }) => {
    const { data, token } = args;
    try {
        const response = await BoardsAPI.createBoard(token, data);
        return response;
    } catch (err) {
        const { statusCode } = err.response.data;
        if (statusCode && statusCode === - 100) {
            dispatch(logoutAction());
        } else {
            throw new Error('Request failed.');
        }
    }
});

const initialState = {
    status: 'idle',
    data: [],
    error: null
};

export const getBoardsSelector = (state) => state.boards.data;

export const boardsByNameSelector = (state, name) => {
    return state.boards.data.filter(board => board.name.toLowerCase().includes(name.toLowerCase()));
}

export const boardsPagingSelector = (state, page, itemsPerPage, filter) => {
    const boards = boardsByNameSelector(state, filter);
    const totalAmountOfPages = Math.ceil(boards.length / itemsPerPage);
    return { items: boards.slice((page - 1) * itemsPerPage, page * itemsPerPage), totalAmountOfPages };
}

export const boardByIdSelector = (state, id) => state.boards.data.find(board => board._id === id);

export const boardsArraySizeSelector = (state) => state.boards.data.length;


export const boards = createSlice({
    name: 'boards',
    initialState: initialState,
    reducers: {
        resetBoards: (state, action) => {
            state = initialState;
            return state;
        }
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

export const { resetBoards } = boards.actions;

