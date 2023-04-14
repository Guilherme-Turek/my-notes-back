import { UserRepository } from "../../user/repository/user.repository";

interface LoginParams {
  username: string;
  password: string;
}

export class LoginUsecase {
  public async execute(data: LoginParams) {
    const repository = new UserRepository();
    const user = await repository.getByUsername(data.username, data.password);

    if (!user) {
      return {
        ok: false,
        code: 404,
        message: "User not found",
      };
    }

    return user;
  }
}
