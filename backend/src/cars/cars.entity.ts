import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { Reservation } from './reservation.entity';
import { CarModel } from 'src/car-model/car-model.entity';
import { Company } from 'src/company/company.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, company => company.cars, { eager: false })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.cars)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  carModelId: string;

  @ManyToOne(() => CarModel, carModel => carModel.cars, { eager: false })
  @JoinColumn({ name: 'carModelId' })
  carModel?: CarModel;

  @Column({ length: 50, unique: true })
  licensePlate: string;

  @Column({ length: 17, unique: true })
  vin: string;

  @Column({ type: 'varchar', length: 50 })
  color: string;

  @Column({ type: 'int', default: 0 })
  mileage: number;

  @Column({ type: 'enum', enum: ['available', 'rented', 'maintenance', 'out_of_service'], default: 'available' })
  status: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string;

  @Column({ type: 'date', nullable: true })
  lastServiceDate: Date;

  @Column({ type: 'date', nullable: true })
  nextServiceDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // @OneToMany(() => Reservation, reservation => reservation.car)
  // reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
