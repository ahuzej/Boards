import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BoardsAPI from "../api/BoardsAPI";
import { logoutAction } from "./userSlice";



export const getAllBoards = createAsyncThunk('boards/getAllBoards', async (args, { dispatch, getState, rejectWithValue }) => {
    try {
        const user = getState().user.data;
        const response = await BoardsAPI.getAll(user.token, user.id);
        return response;
    } catch (err) {
        let rejectMessage = 'Error has occured.';
        if (err.response) {
            const { statusCode } = err.response.data;
            if (statusCode === - 100) {
                dispatch(logoutAction());
                return;
            } else {
                rejectMessage = err.response.data.msg;
            }
        }
        return rejectWithValue(rejectMessage);
    }
});

export const createBoard = createAsyncThunk('boards/createBoard', async (args, { dispatch, getState, rejectWithValue }) => {
    const { data, onOk, onError } = args;
    try {
        const user = getState().user.data;

        const response = await BoardsAPI.createBoard(user.token, data);
        onOk();
        return response;
    } catch (err) {
        onError();
        let rejectMessage = 'Error has occured.';
        if (err.response) {
            const { statusCode } = err.response.data;
            if (statusCode === - 100) {
                dispatch(logoutAction());
                return;
            } else {
                rejectMessage = err.response.data.msg;
            }
        }
        return rejectWithValue(rejectMessage);
    }
});

const initialState = {
    status: 'idle',
    data: [],
    error: null
};

export const getBoardsSelector = (state) => state.boards.data;

export const boardsByNameSelector = (state, name) => {
    console.log(state.boards);
    return state.boards.data.filter(board => board.name.toLowerCase().includes(name.toLowerCase()));
}


export const boardsPagingSelector = (state, page, itemsPerPage, filter) => {
    const boards = boardsByNameSelector(state, filter);
    const totalAmountOfPages = Math.ceil(boards.length / itemsPerPage);
    return { items: boards.slice((page - 1) * itemsPerPage, page * itemsPerPage), totalAmountOfPages };
}

export const boardByIdSelector = (state, id) => {
    return state.boards.data ? state.boards.data.find(board => board._id === id) : {};
}

export const boardsArraySizeSelector = (state) => state.boards.data.length;

export const getBoardsErrorSelector = (state) => state.boards.error;

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
            state.error = null;
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

