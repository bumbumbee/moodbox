import {
  FETCH_ALL_POSTS,
  FETCH_SINGLE_POST,
  GET_ERRORS,
  LIKE_POST,
  COMMENT_POST,
  DELETE_POST} from './types';

import axios from 'axios';

export function fetchAllPosts() {
  return async function (dispatch) {
    // darom uzklausa i backend (posts)
    try{
      const res = await axios.get('/api/posts');
      dispatch({
        type:FETCH_ALL_POSTS,
        payload:res.data
      })
    }catch (err){
      console.log(err);
      dispatch({
        type:GET_ERRORS,
        payload:'unexpected server error'
      })
    }
  }
}

export function fetchSinglePost(title) {
  return async function (dispatch) {
    try{
      const res = await axios.get(`/api/post/${title}`);
      dispatch({
        type:FETCH_SINGLE_POST,
        payload:res.data
      })
    }catch (err){
      console.log(err);
      dispatch({
        type:GET_ERRORS,
        payload:{post:'post not found'}
      })
    }
  }
}

export function deletePost(id) {
  return async function (dispatch) {
    try{
      await axios.delete('/api/posts/'+id);
      dispatch({
        type:DELETE_POST,
        payload:id
      })
    }catch (err){

    }
  }
}

export function likePost(id) {
  return async function (dispatch) {
    try{
      const res = await axios.post('/api/posts/'+id);
      dispatch({
        type:LIKE_POST,
        payload:res.data
      })
    }catch (err){
      console.log(err);
    }
  }
}

export function commentPost(id,comment) {
  return async function (dispatch) {
    try{
      const res = await axios.post('/api/post-comment/'+id, {comment});
      console.log(res.data)
      dispatch({
        type:COMMENT_POST,
        payload:res.data
      })
    }catch (err){
      console.log(err);
      dispatch({
        type:GET_ERRORS,
        payload:{message:'internal server error'}
      })
    }
  }
}