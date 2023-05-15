import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { NoteStatus } from "../../../models/note.model";
import { UserEntity } from "./user.entity";

@Entity("note")
export class NoteEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: "varchar",
    enum: ["active", "filed"],
  })
  status: NoteStatus;

  @Column({
    name: "id_user",
  })
  idUser: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: "id_user",
  })
  user: UserEntity;

  @CreateDateColumn({
    name: "dthr_create",
  })
  dthrCreate: Date;

  @CreateDateColumn({
    name: "dthr_update",
  })
  dthrUpdate: Date;
}
