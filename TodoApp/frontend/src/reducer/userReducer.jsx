import { SET_USER, UNSET_USER } from "./userAction.types";

function userReducer(user,action){
    console.log("userReducer");

    switch (action.type) {
        case SET_USER:{
        return action.payload
        }


        case UNSET_USER:{
            return {}
        }
            
           
    
        default:
            return user;
    }
}

export default userReducer