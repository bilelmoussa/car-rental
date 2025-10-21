import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Car } from '../cars/cars.entity';
import { Company } from 'src/company/company.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class CarModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  brand: string;

  @Column({ length: 100 })
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'enum', enum: ['sedan', 'suv', 'truck', 'van', 'convertible', 'coupe', 'hatchback'] })
  category: string;

  @Column({ type: 'int' })
  seats: number;

  @Column({ type: 'enum', enum: ['manual', 'automatic'] })
  transmission: string;

  @Column({ type: 'enum', enum: ['gasoline', 'diesel', 'electric', 'hybrid'] })
  fuelType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dailyRate: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  features: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @OneToMany(() => Car, car => car.carModel)
  cars?: Car[];

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, company => company.carModels, { eager: false })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.carModels, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
