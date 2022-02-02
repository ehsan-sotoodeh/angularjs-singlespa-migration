import axios from "axios"
import { auth$ } from "@react-mf/root-config";


//TODO get API_URL from env
const API_URL = "http://0.0.0.0:8080"

const axiosApi = axios.create({
  baseURL: API_URL,
})

auth$.subscribe(status => {
  if(!status.pending && status.accessToken){
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${status.accessToken}`
    axiosApi.defaults.baseURL = API_URL;
    axiosApi.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
    axiosApi.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
  }
});


const fetchToken = async() => {
  return new Promise((resolve,reject) => {
    auth$.subscribe(status => {
      if(!status.pending && status.accessToken){
        resolve(status.accessToken)
      }
    });
  })
}

const addHeaders = async () => {
    const accessToken = await fetchToken();
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
    axiosApi.defaults.baseURL = API_URL;
    axiosApi.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
    axiosApi.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
}

addHeaders();

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export async function get(url, config = {}) {
  if(!axiosApi.defaults.headers.common["Authorization"]){
    await addHeaders();
  }
  return await axiosApi.get(url, { ...config }).then(response => response.data)
}

export async function post(url, payload, config = {}) {
  //TODO should not pass the params as headers
  //fix this once api accepts the params at the right place
  if(!axiosApi.defaults.headers.common["Authorization"]){
    await addHeaders();
  }
  axiosApi.defaults.headers.post = {
    ...axiosApi.defaults.headers.post,
    ...payload
  }
  console.log(payload);
  return axiosApi
    .post(url, { ...payload }, {...config})
    .then(response => response.data)
}

export async function put(url, data, config = {}) {
  if(!axiosApi.defaults.headers.common["Authorization"]){
    await addHeaders();
  }
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function patch(url, data, config = {}) {
  if(!axiosApi.defaults.headers.common["Authorization"]){
    await addHeaders();
  }
  return axiosApi
    .patch(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function del(url, config = {}) {
  if(!axiosApi.defaults.headers.common["Authorization"]){
    await addHeaders();
  }
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}
