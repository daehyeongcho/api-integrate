// 이 함수는 패러미터로 액션의 타입과 Promise를 만들어주는 함수를 받아옵니다.
const createAsyncDispatcher = (type, promiseFn) => {
  // 성공, 실패에 대한 액션 타입 문자열을 준비합니다.
  const SUCCESS = `${type}_SUCCESS`;
  const ERROR = `${type}_ERROR`;

  // 새로운 함수를 만듭니다.
  // ...rest를 사용하여 나머지 패러미터를 rest 배열에 담습니다.
  const actionHandler = async (dispatch, ...rest) => {
    dispatch({ type });
    try {
      const data = await promiseFn(...rest); // rest 배열을 spread로 넣어줍니다.
      dispatch({ type: SUCCESS, data }); // 성공함
    } catch (e) {
      dispatch({ type: ERROR, error: e }); // 실패함
    }
  };

  return actionHandler;
};
export default createAsyncDispatcher;

export const initialAsyncState = {
  loading: false,
  data: null,
  error: null,
};

// 로딩중일 때 바뀔 상태 객체
const loadingState = {
  data: null,
  error: null,
  loading: true,
};

// 성공했을 때의 상태 만들어주는 함수
const success = (data) => ({
  data,
  error: null,
  loading: false,
});

// 실패했을 때의 상태 만들어주는 함수
const error = (error) => ({
  data: null,
  error,
  loading: false,
});

// 세 가지 액션을 처리하는 리듀서를 만들어줍니다
// type은 액션타입, key는 리듀서에서 사용할 필드 이름(ex. users, user)
export const createAsyncHandler = (type, key) => {
  // 성공, 실패에 대한 액션 타입 문자열을 준비합니다.
  const SUCCESS = `${type}_SUCCESS`;
  const ERROR = `${type}_ERROR`;

  const handler = (state, action) => {
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: loadingState,
        };
      case SUCCESS:
        return {
          ...state,
          [key]: success(action.data),
        };
      case ERROR:
        return {
          ...state,
          [key]: error(action.error),
        };
      default:
        return state;
    }
  };

  return handler;
};
