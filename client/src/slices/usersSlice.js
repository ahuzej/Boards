import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import ProjectAPI from "../api/ProjectAPI";
import { logoutAction } from "./userSlice";

export const fetchUsersForBoard = createAsyncThunk('users/fetchUsersForBoard', async (args, { dispatch, getState }) => {
    const { username, boardId } = args;
    try {
        const user = getState().user.data;
        const response = await ProjectAPI.getUsers(user.token, username, boardId);
        console.log(response);
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

export const addUsersToBoard = createAsyncThunk('users/addUsersToBoard', async (args, { dispatch, getState }) => {
    const { users, boardId } = args;
    try {
        const user = getState().user.data;
        await ProjectAPI.addUsersToBoard(user.token, boardId, { users });
        return {
            boardId,
            users
        };
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
        }
    }
});