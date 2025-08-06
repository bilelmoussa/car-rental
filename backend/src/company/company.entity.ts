import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.company, { nullable: false, onDelete: 'SET NULL', eager: true })
  user: User;

  @OneToMany(() => User, (user) => user.company, { eager: false })
  users: User[]

  @Column()
  address: string;

  @Column({ type: "varchar", length: 2 })
  country: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'text', nullable: true })
  registrationNumber?: string;
}
