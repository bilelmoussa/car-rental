import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Gender } from '../enums/Gender';
import { Role } from '../enums/Role';
import { Exclude } from 'class-transformer';
import { Company } from 'src/company/company.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: "enum", enum: Gender })
  gender: Gender;

  @Column({ type: "enum", enum: Role, default: Role.CUSTOMER })
  role: Role;

  @Column({ select: false })
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

  @Column({ type: 'text', nullable: true })
  @Exclude()
  refreshToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  refreshTokenExpiresAt: Date | null;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
