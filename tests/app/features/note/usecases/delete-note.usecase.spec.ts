import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";
import { DeleteNoteUsecase } from "../../../../../src/app/features/note/usecases/delete-note.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { Note } from "../../../../../src/app/models/note.model";
import { User } from "../../../../../src/app/models/user.model";
import { CacheRepository } from "../../../../../src/app/shared/repositories/cache.repository";
import { RedisConnection } from "../../../../../src/main/database/redis.connections";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";

describe("Note delete usecase tests", () => {
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
    return new DeleteNoteUsecase();
  };

  test("deve retornar 404 se não encontrar usuário ", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute("anyid", "anyiduser");
    expect(result).toBeDefined();
    expect(result.code).toBe(404);
  });

  test("deve retornar 404 se não encontrar nota", async () => {
    jest
      .spyOn(UserRepository.prototype, "get")
      .mockResolvedValue(new User("anyusername", "anystring"));
    jest.spyOn(NoteRepository.prototype, "getById").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute("anyid", "anyiduser");
    expect(result).toBeDefined();
    expect(result.code).toBe(404);
  });

  test("deve retornar 200 se a nota for excluida", async () => {
    jest
      .spyOn(UserRepository.prototype, "get")
      .mockResolvedValue(new User("anyusername", "anystring"));
    jest.spyOn(NoteRepository.prototype, "delete").mockResolvedValue(1);

    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

    const sut = makeSut();

    const result = await sut.execute("anyid", "anyiduser");
    expect(result).toBeDefined();
    expect(result.code).toBe(200);
  });
});
