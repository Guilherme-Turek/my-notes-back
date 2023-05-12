import {
  LoginParams,
  LoginUsecase,
} from "../../../../../src/app/features/login/usecases/login.usecase";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { User } from "../../../../../src/app/models/user.model";

describe("Login usecase tests", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const makeSut = () => {
    return new LoginUsecase();
  };

  const user = {
    username: "anyname",
    password: "anypassword",
  };

  test("deve retornar erro(404) se não encontrar usuário", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByUsername")
      .mockResolvedValue(null);
    const sut = makeSut();

    const result = await sut.execute(user);

    expect(result.code).toBe(404);
  });

  test("deve retornar sucesso(200) se o login for efetuado", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByUsername")
      .mockResolvedValue(new User(user.username, user.password));
    const sut = makeSut();

    const result = await sut.execute(user);
    expect(result.code).toBe(200);
  });
});
