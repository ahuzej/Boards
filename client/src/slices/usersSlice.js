import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BoardsAPI from "../api/BoardsAPI";
import { logoutAction } from "./userSlice";

export const fetchUsersForBoard = createAsyncThunk('users/fetchUsersForBoard', async (args, { dispatch, getState, rejectWithValue }) => {
    const { username, boardId } = args;
    try {
        const user = getState().user.data;
        const response = await BoardsAPI.getUsers(user.token, username, boardId);
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

export const fetchUserById = createAsyncThunk('users/fetchUserById', async (args, { dispatch, getState, rejectWithValue }) => {
    const { id } = args;
    try {
        const user = getState().user.data;
        const response = await BoardsAPI.getUserById(user.token, id);
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

export const fetchProfileById = createAsyncThunk('users/fetchProfileById', async (args, { dispatch, getState, rejectWithValue }) => {
    const { id } = args;
    try {
        const user = getState().user.data;
        const response = await BoardsAPI.fetchProfileById(user.token, id);
        console.log(response)
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

export const addUsersToBoard = createAsyncThunk('users/addUsersToBoard', async (args, { dispatch, getState, rejectWithValue }) => {
    const { users, boardId } = args;
    try {
        const user = getState().user.data;
        await BoardsAPI.addUsersToBoard(user.token, boardId, { users });
        return {
            boardId,
            users
        };
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

const initialState = {
    status: 'idle',
    data: [],
    error: null
};

export const getUsersSelector = (state) => {
    return state.users.data;
}

export const usersStatusSelector = (state) => {
    return state.users.status;
}

export const userByUsernameSelector = (state, username, boardId) => {
    return state.users.data.filter(user => user.username.toLowerCase().includes(username.toLowerCase()) && !user.boards.includes(boardId));
}

export const usersByBoardSelector = (state, boardId) => {
    return state.users.data.filter(user => user.boards.includes(boardId));
}

export const usersByIdSelector = (state, id) => {
    let users = state.users.data;
    let user = null;
    for(let i=0; i < users.length; i++) {
        if(users[i]._id === id) {
            user = users[i];
            break;
        }
    }
    return user;
}

export const getUsersError = (state) => state.users.error;

function setStatusToFailed(state, action) {
    state.status = 'failed';
    return state;

}

export const users = createSlice({
    name: 'users',
    initialState,
    reducers: {
    },
    extraReducers: {
        [fetchUsersForBoard.pending]: (state, action) => {
            state.status = 'loading';
            return state;
        },
        [fetchUsersForBoard.fulfilled]: (state, action) => {
            if (action.payload) {
                const users = action.payload;

                // only add new user if it already isn't in the state
                let currentUsers = state.data;
                for (let i = 0, responseLength = users.length; i < responseLength; i++) {
                    let exists = false;
                    for (let j = 0, currentUsersLength = currentUsers.length; j < currentUsersLength; j++) {
                        if (currentUsers[j]._id === users[i]._id) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        currentUsers.push(users[i]);
                    }
                }
                state.status = 'complete';
            }
            return state;
        },
        [fetchUsersForBoard.rejected]: (state, action) => {
            state.status = 'failed';
            return state;
        },
        [addUsersToBoard.fulfilled]: (state, action) => {
            let users = state.data;
            let { boardId, users: addedUsersIds } = action.payload;
            for (let i = 0; i < users.length; i++) {
                let currentUser = users[i];
                for (let j=0; j < addedUsersIds.length; j++) {
                    let currentAdddedUserId = addedUsersIds[j];
                    currentUser._id === currentAdddedUserId && currentUser.boards.push(boardId);
                }
            }
            return state;
        },
        [fetchUserById.fulfilled]: (state, action) => {
            let users = state.data;
            let fetchedUser  = action.payload;
            let exists = false;
            for (let i = 0; i < users.length; i++) {
                let currentUser = users[i];
                if(currentUser._id === fetchedUser._id) {
                    users[i] = fetchedUser;
                    exists = true;
                    break;
                }
            }
            if(!exists) {
                users.push(fetchedUser);
            }
            state.status = 'complete';
            return state;
        },
        [fetchProfileById.fulfilled]: (state, action) => {
            let users = state.data;
            let fetchedUser  = action.payload;
            let exists = false;
            for (let i = 0; i < users.length; i++) {
                let currentUser = users[i];
                if(currentUser._id === fetchedUser._id) {
                    Object.assign(users[i], fetchedUser);
                    exists = true;
                    break;
                }
            }
            if(!exists) {
                users.push(fetchedUser);
            }
            state.status = 'complete';
            return state;
        },
        [fetchUserById.rejected]: setStatusToFailed,
        [fetchProfileById.rejected]: setStatusToFailed,
    }
});