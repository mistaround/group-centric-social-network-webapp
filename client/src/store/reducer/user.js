const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        name: action.payload.name,
        // eslint-disable-next-line no-underscore-dangle
        id: action.payload._id,
        avatarUrl: action.payload.avatarUrl,
      };
    default:
      return state;
  }
};

export default userReducer;
