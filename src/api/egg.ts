import { backend } from "../lib/axios";
import { EGGS_INFO } from "../type/egg";


export async function fetchEggCount(): Promise<EGGS_INFO> {
  return backend.get('/eggs_countdown.php')
    .then((res) => res.data as EGGS_INFO)
}