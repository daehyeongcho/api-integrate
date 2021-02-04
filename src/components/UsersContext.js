import React, { createContext, useReducer, useContext } from "react";
import createAsyncDispatcher, {
  initialAsyncState,
  createAsyncHandler,
} from "./asyncActionUtils";
import * as api from "./api";

// UsersContext에서 사용 할 기본 상태
const initialState = {
  users: initialAsyncState,
  user: initialAsyncState,
};

const usersHandler = createAsyncHandler("GET_USERS", "users");
const userHandler = createAsyncHandler("GET_USER", "user");
const reducer = (state, action) => {
  switch (action.type) {
    case "GET_USERS":
    case "GET_USERS_SUCCESS":
    case "GET_USERS_ERROR":
      return usersHandler(state, action);
    case "GET_USER":
    case "GET_USER_SUCCESS":
    case "GET_USER_ERROR":
      return userHandler(state, action);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// State용 Context와 Dispatch용 Context 따로 만들어주기
const UsersStateContext = createContext(null);
const UsersDispatchContext = createContext(null);

// 위에서 선언한 두 가지 Context 들의 Provider로 감싸주는 컴포넌트
export const UsersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UsersStateContext.Provider value={state}>
      <UsersDispatchContext.Provider value={dispatch}>
        {children}
      </UsersDispatchContext.Provider>
    </UsersStateContext.Provider>
  );
};

export const useUsersState = () => {
  const state = useContext(UsersStateContext);
  if (!state) {
    throw new Error("Cannot find UsersProvider");
  }
  return state;
};

export const useUsersDispatch = () => {
  const dispatch = useContext(UsersDispatchContext);
  if (!dispatch) {
    throw new Error("Cannot find UsersProvider");
  }
  return dispatch;
};

export const getUsers = createAsyncDispatcher("GET_USERS", api.getUsers);
export const getUser = createAsyncDispatcher("GET_USER", api.getUser);
