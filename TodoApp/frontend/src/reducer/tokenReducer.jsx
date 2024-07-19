const TokenReducer = (state, action) => {
    switch (action.type) {
      case 'SET_TOKEN':
        localStorage.setItem('authToken', JSON.stringify(action.payload));
        return action.payload;
      case 'REMOVE_TOKEN':
        localStorage.removeItem('authToken');
        return null;
      default:
        return state;
    }
  };
  
  export default TokenReducer