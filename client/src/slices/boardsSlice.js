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
    error: null,
    sortOrder: null
};

export const getBoardsSelector = (state) => state.boards.data;

export const boardsByNameSelector = (state, name) => {
    let data = state.boards.data;
    return data ? data.filter(board => board.name.toLowerCase().includes(name.toLowerCase())) : {};
}

export const boardsPagingSelector = (state, page, itemsPerPage, filter) => {
    const boards = boardsByNameSelector(state, filter);
    const totalAmountOfPages = Math.ceil(boards.length / itemsPerPage);
    return { items: boards.slice((page - 1) * itemsPerPage, page * itemsPerPage), totalAmountOfPages };
}

export const boardByIdSelector = (state, id) => {
    return state.boards.data ? state.boards.data.find(board => board._id === id) : {};
}

export const boardsSortSelector = (state) => {
    return state.boards.sortOrder;
}
export const boardsArraySizeSelector = (state) => state.boards.data.length;

export const getBoardsErrorSelector = (state) => state.boards.error;

export const sortBoardsSelectorOutput = (data, sortBy) => {
    let items = data.items;
    let sortFunction;
    switch (sortBy) {
        case 'none':
        default:
            sortFunction = null;
            break;
        case 'ascending':
            sortFunction = (a, b) => {
                let nameA = a.name.toUpperCase();
                let nameB = b.name.toUpperCase();

                if(nameA > nameB) {
                    return 1;
                }
                if(nameA < nameB) {
                    return -1;
                }
                return 0;
            }
            break;
        case 'descending':
            sortFunction = (a, b) => {
                let nameA = a.name.toUpperCase();
                let nameB = b.name.toUpperCase();

                if(nameA < nameB) {
                    return 1;
                }
                if(nameA > nameB) {
                    return -1;
                }
                return 0;

            }
            break;
    }
    if (sortFunction != null) {
        items = items.slice().sort(sortFunction);
    }
    return  {
        ...data,
        items
    };
}

export const boards = createSlice({
    name: 'boards',
    initialState: initialState,
    reducers: {
        resetBoards: (state, action) => {
            state = initialState;
            return state;
        },
        boardSortChanged: (state, action) => {
            state.sortOrder = action.payload;
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
        [createBoard.fulfilled]: (state, action) => {
            state.status = 'complete';
            state.error = null;
            console.log(action.payload);
            state.data.push(action.payload);
            return state;
        }
    }
});

export const { resetBoards } = boards.actions;
export const { boardSortChanged } = boards.actions;

