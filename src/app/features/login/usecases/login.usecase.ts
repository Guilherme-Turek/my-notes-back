import { UserReturn } from "../../../shared/utils/userReturn.contract";
import { UserRepository } from "../../user/repository/user.repository";

export interface LoginParams {
  username: string;
  password: string;
}

export class LoginUsecase {
  public async execute(data: LoginParams): Promise<UserReturn> {
    const repository = new UserRepository();
    const user = await repository.getByUsername(data.username, data.password);

    if (user) {
      return {
        ok: true,
        code: 200,
        message: "Login successfully",
        data: user,
      };
    }
    return {
      ok: false,
      code: 404,
      message: "User not found",
    };
  }
}
