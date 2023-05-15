import { UpdateNoteUsecase } from "../../../../../src/app/features/note/usecases/update-note.usercase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { Note } from "../../../../../src/app/models/note.model";
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

  const note: Note = new Note("anytitle", "anydescription", "anyiduser");

  test("deve retornar 404 se não encontrar usuário ", async () => {
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);

    const sut = makeSut();

    const result = await sut.execute({ id: "anyid", idUser: "anyiduser" });
    expect(result).toBeDefined();
    expect(result.code).toBe(404);
  });
});
