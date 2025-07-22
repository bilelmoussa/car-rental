import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Gender } from './Gender';
import { Role } from './Role';
import { Exclude } from 'class-transformer';
import { Company } from 'src/company/company.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: "enum", enum: Gender })
  gender: Gender;

  @Column({ type: "enum", enum: Role, default: Role.Customer })
  role: Role;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ type: "varchar", length: 2, nullable: true })
  country?: string;

  @ManyToOne(() => Company, (company) => company.users)
  company?: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
