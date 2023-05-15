import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";
import { ListNotesUsecase } from "../../../../../src/app/features/note/usecases/list-notes.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { Note } from "../../../../../src/app/models/note.model";
import { User } from "../../../../../src/app/models/user.model";
import { CacheRepository } from "../../../../../src/app/shared/repositories/cache.repository";
import { RedisConnection } from "../../../../../src/main/database/redis.connections";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";

describe("Note list usecase tests", () => {
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
    return new ListNotesUsecase();
  };

  const note: Note = new Note("anytitle", "anydescription", "anyiduser");

  test("deve retornar 404 se não encontrar usuário ", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute("anyiduser");
    expect(result).toBeDefined();
    expect(result.code).toBe(404);
  });

  test("deve retornar 200 se retornar a lista de notas do cache", async () => {
    jest
      .spyOn(UserRepository.prototype, "get")
      .mockResolvedValue(new User("anyusername", "anypassword"));
    jest
      .spyOn(NoteRepository.prototype, "list")
      .mockResolvedValue([note, note, note]);

    const sut = makeSut();

    const result = await sut.execute("anyiduser");
    expect(result).toBeDefined();
    expect(result.code).toBe(200);
  });

  test("deve retornar 200 se retornar a lista", async () => {
    jest
      .spyOn(UserRepository.prototype, "get")
      .mockResolvedValue(new User("anyusername", "anypassword"));

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);

    jest
      .spyOn(NoteRepository.prototype, "list")
      .mockResolvedValue([note, note, note]);

    jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();

    const sut = makeSut();

    const result = await sut.execute("anyiduser");
    expect(result).toBeDefined();
    expect(result.code).toBe(200);
  });
});
