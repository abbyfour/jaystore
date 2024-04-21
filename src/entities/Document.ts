import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

export class Document extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  url!: string;
}
