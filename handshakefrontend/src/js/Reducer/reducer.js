import { LOGIN } from "../Constants/constants";
const initialState = {
  id : '',
  userType :''
};
function rootReducer(state = initialState, action) {
    if (action.type === LOGIN) {
      console.log("processing in reducer")
      return {
        ...initialState,
        id : action.payload.id,
        userType : action.payload.userType
      }
    } 
    
    return state;
  }
  
export default rootReducer;