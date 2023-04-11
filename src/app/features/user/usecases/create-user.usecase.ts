import { UserRepository } from "../repository/user.repository";
import { User } from "../../../models/user.model";

interface CreateUserParams {
  username: string;
  password: string;
  confirmPassword: string;
}

export class CreateUserUsecase {
  public async execute(data: CreateUserParams) {
    const repository = new UserRepository();

    const user = new User(data.username, data.password);

    const result = await repository.create(user);

    return result;
  }
}
