import { FATCH_COMPANY_PROFILE} from "../Constants/constants";
export function login(payload) {
  console.log("dispatching the action")
  return { type: FATCH_COMPANY_PROFILE, payload };
}