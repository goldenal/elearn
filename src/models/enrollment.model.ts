import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Course } from './course.model';
import { Payment } from './payment.model';
import { Progress } from './progress.model';
import { Certificate } from './certificate.model';

@Table({ tableName: 'enrollments' })
export class Enrollment extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @ForeignKey(() => Course)
  @Column({ type: DataType.UUID, allowNull: false })
  declare courseId: string;

  @Default('active')
  @Column({
    type: DataType.ENUM('active', 'completed', 'expired'),
    allowNull: false,
  })
  declare status: 'active' | 'completed' | 'expired';

  @Default(0)
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  declare progressPercentage: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare completedAt: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare expiresAt: Date | null;

  @ForeignKey(() => Payment)
  @Column({ type: DataType.UUID, allowNull: true })
  declare paymentId: string | null;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Course)
  declare course: Course;

  @BelongsTo(() => Payment)
  declare payment: Payment | null;

  @HasMany(() => Progress)
  declare progress: Progress[];

  @HasOne(() => Certificate)
  declare certificate: Certificate | null;
}
