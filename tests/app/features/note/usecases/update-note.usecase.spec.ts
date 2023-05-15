import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";
import { UpdateNoteUsecase } from "../../../../../src/app/features/note/usecases/update-note.usercase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { Note } from "../../../../../src/app/models/note.model";
import { User } from "../../../../../src/app/models/user.model";
import { CacheRepository } from "../../../../../src/app/shared/repositories/cache.repository";
import { RedisConnection } from "../../../../../src/main/database/redis.connections";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";

describe("Note update usecase tests", () => {
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
    return new UpdateNoteUsecase();
  };

  test("deve retornar 404 se não encontrar usuário ", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute({ id: "anyid", idUser: "anyiduser" });
    expect(result).toBeDefined();
    expect(result.code).toBe(404);
  });

  test("deve retornar 404 se não encontrar nota ", async () => {
    jest
      .spyOn(UserRepository.prototype, "get")
      .mockResolvedValue(new User("anyusername", "anypassword"));
    jest.spyOn(NoteRepository.prototype, "getById").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute({ id: "anyid", idUser: "anyiduser" });
    expect(result).toBeDefined();
    expect(result.code).toBe(404);
  });

  test("deve retornar 200 se a nota for editada ", async () => {
    jest
      .spyOn(UserRepository.prototype, "get")
      .mockResolvedValue(new User("anyusername", "anypassword"));

    jest
      .spyOn(NoteRepository.prototype, "getById")
      .mockResolvedValue(new Note("anytitle", "anydescription", "anyiduser"));

    jest
      .spyOn(NoteRepository.prototype, "update")
      .mockResolvedValue(new Note("anytitle", "anydescription", "anyiduser"));

    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

    const sut = makeSut();

    const result = await sut.execute({
      id: "anyid",
      title: "anytitle",
      description: "anydescription",
      idUser: "anyiduser",
    });
    expect(result).toBeDefined();
    expect(result.code).toBe(200);
  });
});
