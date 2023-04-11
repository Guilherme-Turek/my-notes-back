import { UserRepository } from "../../user/repository/user.repository";

interface LoginParams {
  username: string;
  password: string;
}

export class LoginUsecase {
  public async execute(data: LoginParams) {
    const repository = new UserRepository();
    const user = await repository.verifyUserExist(data.username, data.password);

    if (!user) {
      return null;
    }
    return user;
  }
}
