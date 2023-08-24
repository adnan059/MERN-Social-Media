import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state, action) => {
      localStorage.clear();
      state.user = action.payload.others;
      state.token = action.payload.token;
    },
    login: (state, action) => {
      //console.log(action);
      localStorage.clear();
      state.user = action.payload.others;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
    handleFollow: (state, action) => {
      if (!state.user.followings.includes(action.payload)) {
        state.user.followings.push(action.payload);
      } else {
        state.user.followings = state.user.followings.filter(
          (uid) => uid !== action.payload
        );
      }
    },
    bookmarkPost: (state, action) => {
      if (
        state.user.bookmarkedPosts.some(
          (post) => post._id === action.payload._id
        )
      ) {
        state.user.bookmarkedPosts = state.user.bookmarkedPosts.filter(
          (post) => post._id !== action.payload._id
        );
      } else {
        state.user.bookmarkedPosts.push(action.payload);
      }
    },

    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  register,
  login,
  logout,
  handleFollow,
  bookmarkPost,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
