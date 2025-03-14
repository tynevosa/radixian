import axios from "axios"

const backend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_ENDPOINT,
  headers: {
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
})

export { backend };