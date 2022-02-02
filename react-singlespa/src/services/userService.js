// import axios from "axios"
// import async from "react-select/async"
import { del, get, post, patch } from "../helpers/api_helper"
import { auth$ } from "@react-mf/root-config";

const URLS = {
  GET_USER_META_DATA: "/user",
  GET_CURRENT_USER_META_DATA: "/current_user",
  CREATE_USER: "/user"
}

export const getUserMetaData = data => get(URLS.GET_USER_META_DATA, data)
export const getCurrentUserMetaData = data => get(URLS.GET_CURRENT_USER_META_DATA, data)
export const createUser = data => post(URLS.CREATE_USER, data)

export const getCurrentUser = async () => {
  return new Promise((resolve,reject) => {
    auth$.subscribe(status => {
      if(!status.pending && status.authCode === 200){
        resolve(status.currentUser.docs[0]);
      }
    });
  })
}

export const updateUser = async (user) => {
  const response = await patch('user', user)
    .then(r => { return { succeeded: r.success, data: r.docs[0], error: r.error } })
    .catch(e => { return { succeeded: false, data: {}, error: e.response } });
  return response;
}

export const createNewUser = async (user) => {
  const response = await post('user', user)
    .then(r => { return { succeeded: r.success, data: r.doc_ids, error: r.error } })
    .catch(e => { return { succeeded: false, data: [], error: e.response } });
  return response;
}

export const deleteCurrentUser = async () => {
  const response = await del('current_user')
    .then(r => { return { succeeded: r.success, data: r.doc_ids[0], error: r.error } })
    .catch(e => { return { succeeded: false, data: {}, error: e.response } });
  return response;
}

export const getUsers = async (userIds) => {
  const response = await get('user', { params: { ids: userIds } })
    .then(r => { return { succeeded: r.success, data: r.docs } })
    .catch(e => { return { succeeded: false, data: [], error: e.response || e.message } });
  return response;
}




