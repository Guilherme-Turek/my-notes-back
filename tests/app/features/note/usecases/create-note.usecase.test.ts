import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";
import { CreateNoteUsecase } from "../../../../../src/app/features/note/usecases/create-note.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create-user.usecase";
import { Note } from "../../../../../src/app/models/note.model";
import { User } from "../../../../../src/app/models/user.model";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
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

  const makeNoteSut = () => {
    return new CreateNoteUsecase();
  };
  const makeUserSut = () => {
    return new CreateUserUsecase();
  };

  test("deve retornar 404 se não encontrar usuário ", async () => {
    const sut = makeNoteSut();

    const result = await sut.execute({
      title: "anytitle",
      description: "anydescription",
      idUser: "anyid",
    });
    expect(result).toBeDefined();
    expect(result.code).toBe(404);
  });

  test("deve retornar 201 se a nota for criada ", async () => {
    const sutNote = makeNoteSut();
    const sutUser = makeUserSut();

    const userResult = await sutUser.execute({
      username: "anyname",
      password: "anypassword",
      confirmPassword: "anypassword",
    });

    const result = await sutNote.execute({
      title: "anytitle",
      description: "anydescription",
      idUser: userResult.data!.id,
    });
    expect(result).toBeDefined();
    expect(result.code).toBe(201);
  });
});
