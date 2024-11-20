import axios from "axios"

export const getImage = (path) => {
  let url = process.env.API_URL + `/v1/images?url=${encodeURI(path)}`

  return axios.get(url).then((response) => {
    return response
  }).catch((err) => {
    console.log(err);
  })
}