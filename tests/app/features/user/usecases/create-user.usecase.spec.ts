import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { CreateUserUsecase } from "./../../../../../src/app/features/user/usecases/create-user.usecase";

describe("Create user usecase tests", () => {
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
    return new CreateUserUsecase();
  };

  const user = {
    username: "anyname",
    password: "anypassword",
    confirmPassword: "anypassword",
  };

  test("deve retonar 400 se o usuário já existe", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByUsername")
      .mockResolvedValue(new User(user.username, user.password));

    const sut = makeSut();

    const result = await sut.execute(user);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 400);
    expect(result).toHaveProperty("message", "User already exist!");
  });

  test("deve retornar 201. o usuário foi criado", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByUsername")
      .mockResolvedValue(null);
    jest
      .spyOn(UserRepository.prototype, "create")
      .mockResolvedValue(new User(user.username, user.password));

    const sut = makeSut();

    const result = await sut.execute(user);

    expect(result).toBeDefined();
    expect(result.ok).toBe(true);
    expect(result.code).toBe(201);
    expect(result.message).toBe("User created");
    expect(result.data).toBeDefined();
    expect(result.data).toHaveProperty("username", user.username);
    expect(result.data).toHaveProperty("password", user.password);
    expect(result.data.id).toBeDefined();
    expect(result.data.id).toHaveLength(36);
  });
});
