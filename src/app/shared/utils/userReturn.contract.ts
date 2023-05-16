import { User } from "../../models/user.model";
import { BaseReturn } from "./baseReturn.contract";

export interface UserReturn extends BaseReturn {
  data?: User;
}
