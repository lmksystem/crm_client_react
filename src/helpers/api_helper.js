import axios from "axios";

console.log(process.env.REACT_APP_API_URL);

// default
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.defaults.withCredentials = false;

// content type
// const token = JSON.parse(localStorage.getItem("authUser")) ? JSON.parse(localStorage.getItem("authUser")).token : null;
// if(token)
// axios.defaults.headers.common["Authorization"] = "Bearer " + token;
// intercepting to capture errors
axios.interceptors.request.use(async (config) => {
  const token = JSON.parse(localStorage.getItem("authUser")) ? JSON.parse(localStorage.getItem("authUser")).token : null;
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = (url, params) => {
    let response;
    let paramKeys = [];

    // console.log("params",params);
    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join("&") : "";

      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  /**
   * post given data to url
   */
  create = (url, data) => {
    return axios.post(url, data);
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.patch(url, data);
  };

  put = (url, data) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
  /**
   * For file
   */
  fileSend = (url, data, params) => {
    return axios.post(url, data, params);
  };
}

const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

const updateLoggedUser = (data) => {
  localStorage.setItem("authUser", JSON.stringify(data));
  return data;
};

export { APIClient, setAuthorization, getLoggedinUser, updateLoggedUser };
