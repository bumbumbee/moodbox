import {
  FETCH_ALL_POSTS,
  FETCH_SINGLE_POST,
  LOG_OUT,
  LIKE_POST,
  COMMENT_POST,
  DELETE_POST} from '../actions/types';

export default (state=null, action)=>{
    switch (action.type){
      case FETCH_ALL_POSTS : return action.payload;
      case FETCH_SINGLE_POST : return [action.payload];
      case DELETE_POST :
        console.log(action.payload);
        return  state.filter((post)=>{
            return post._id!==action.payload
        });
      case LIKE_POST:
        console.log(action.payload);
        return state.map((post)=>{
            if(post._id===action.payload._id){
              return {...post, likes:action.payload.likes}
            }else{
              return post
            }
        });
        return state;
      case COMMENT_POST :
        return state.map((post)=>{
          if(post._id===action.payload._id){
            return {...post, comments:action.payload.comments}
          }else{
            return post
          }
        });
      case LOG_OUT : return null;
      default:return state;
    }
}