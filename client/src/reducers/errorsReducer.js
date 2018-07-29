import {GET_ERRORS, LOG_IN} from '../actions/types';

export default (state={}, action)=>{
    switch (action.type){
      case GET_ERRORS : return action.payload;
      case LOG_IN : return  {};
      default : return state
    }
}