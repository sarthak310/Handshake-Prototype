import { LOGIN} from "../Constants/constants";
export function login(payload) {
  console.log("dispatching the action")
  return { type: LOGIN, payload };
}