import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { User } from "../../../../../src/app/models/user.model";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { NoteEntity } from "../../../../../src/app/shared/database/entities/note.entity";
import { RedisConnection } from "../../../../../src/main/database/redis.connections";
describe("list note controller tests", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  afterEach(async () => {
    const noteRepository =
      TypeormConnection.connection.getRepository(NoteEntity);
    await noteRepository.clear();
    const userRepository =
      TypeormConnection.connection.getRepository(UserEntity);
    await userRepository.clear();
  });

  const app = createApp();

  test("deve retornar 404 quando não encontrar usuário ", async () => {
    const result = await request(app).get("/users/:idUser/notes").send({
      title: "anytitle",
      description: "anydescription",
      idUser: "anyiduser",
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(404);
  });

  test("deveria retornar status 200 quando o usecase executar com sucesso ", async () => {
    const userRepository =
      TypeormConnection.connection.getRepository(UserEntity);

    const newUser = userRepository.create(
      new User("anyusername", "anypassword")
    );

    await userRepository.save(newUser);

    const result = await request(app).get(`/users/${newUser.id}/notes`);
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(200);
  });
});
