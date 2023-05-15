import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";
import { CreateNoteUsecase } from "../../../../../src/app/features/note/usecases/create-note.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { Note } from "../../../../../src/app/models/note.model";
import { User } from "../../../../../src/app/models/user.model";
import { CacheRepository } from "../../../../../src/app/shared/repositories/cache.repository";
import { RedisConnection } from "../../../../../src/main/database/redis.connections";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";

describe("Create note usecase test", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const makeSut = () => {
    return new CreateNoteUsecase();
  };

  test("deve retornar 404 se não encontrar usuário ", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute({
      title: "anytitle",
      description: "anydescription",
      idUser: "anyid",
    });
    expect(result).toBeDefined();
    expect(result.code).toBe(404);
  });

  test("deve retornar 201 se a nota for criada ", async () => {
    jest
      .spyOn(UserRepository.prototype, "get")
      .mockResolvedValue(new User("anyusername", "anypassword"));

    jest
      .spyOn(NoteRepository.prototype, "create")
      .mockResolvedValue(new Note("anytitle", "anydescription", "anyiduser"));

    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

    const sut = makeSut();

    const result = await sut.execute({
      title: "anytitle",
      description: "anydescription",
      idUser: "anyiduser",
    });
    expect(result).toBeDefined();
    expect(result.code).toBe(201);
  });
});
