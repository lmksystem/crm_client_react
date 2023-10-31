import axios from "axios"
import { api } from "../config"

export const getImage = (path) => {
  let url = api.API_URL + `/v1/images?url=${encodeURI(path)}`

  return axios.get(url).then((response) => {
    return response
  })
}