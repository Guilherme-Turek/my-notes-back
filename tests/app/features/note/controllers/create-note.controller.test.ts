import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { NoteEntity } from "../../../../../src/app/shared/database/entities/note.entity";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { User } from "../../../../../src/app/models/user.model";
import { RedisConnection } from "../../../../../src/main/database/redis.connections";
describe("Create note controller integration tests", () => {
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

  test("deveria retornar 400 quando o title não for informado", async () => {
    const result = await request(app).post("/users/:idUser/notes").send({
      description: "anydescription",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("body.message", "Title was not provided!");
  });

  test("deveria retornar 400 quando a descrição não for informado", async () => {
    const result = await request(app).post("/users/:idUser/notes").send({
      title: "anytitle",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty(
      "body.message",
      "Description was not provided!"
    );
  });

  test("deve retornar 404 quando não encontrar usuário ", async () => {
    const result = await request(app).post("/users/:idUser/notes").send({
      title: "anytitle",
      description: "anydescription",
      idUser: "anyiduser",
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(404);
  });

  test("deve retornar 201 se a nota for criada ", async () => {
    const userRepository =
      TypeormConnection.connection.getRepository(UserEntity);

    const newUser = userRepository.create(
      new User("anyusername", "anypassword")
    );

    await userRepository.save(newUser);

    const result = await request(app).post(`/users/${newUser.id}/notes`).send({
      title: "anytitle",
      description: "anydescription",
    });

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(201);
  });
});
