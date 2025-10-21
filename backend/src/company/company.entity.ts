import { CarModel } from "src/car-model/car-model.entity";
import { Car } from "src/cars/cars.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string

  @Column({ length: 100, unique: true })
  email: string;

  @Column()
  address: string;

  @Column({ type: "varchar", length: 2 })
  country: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ type: 'text', nullable: true })
  registrationNumber?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => CarModel, carModel => carModel.company, { eager: false })
  carModels?: CarModel[];

  @OneToMany(() => Car, car => car.company)
  cars?: Car[];

  @Column({ type: 'uuid' })
  ownerId: string;

  @ManyToOne(() => User, user => user.company, {
    nullable: false,
    onDelete: 'RESTRICT',
    eager: false,
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => User, (user) => user.company)
  employees?: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
