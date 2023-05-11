import { UserRepository } from "../repository/user.repository";
import { User } from "../../../models/user.model";
import { Return } from "../../../shared/utils/return.contract";

interface CreateUserParams {
  username: string;
  password: string;
  confirmPassword: string;
}

export class CreateUserUsecase {
  public async execute(data: CreateUserParams): Promise<Return> {
    const repository = new UserRepository();
    const user = await repository.getByUsername(data.username);

    if (user) {
      return {
        ok: false,
        code: 400,
        message: "User already exist!",
      };
    }

    const newUser = new User(data.username, data.password);

    const result = await repository.create(newUser);

    return {
      ok: true,
      code: 201,
      message: "User created",
      data: result,
    };
  }
}
