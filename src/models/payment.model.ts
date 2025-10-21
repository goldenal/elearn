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
} from 'sequelize-typescript';
import { User } from './user.model';
import { Enrollment } from './enrollment.model';

@Table({ tableName: 'payments' })
export class Payment extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare transactionId: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare amount: string;

  @Default(0)
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare tax: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare totalAmount: string;

  @Default('INR')
  @Column({ type: DataType.STRING, allowNull: false })
  declare currency: string;

  @Default('pending')
  @Column({
    type: DataType.ENUM('pending', 'completed', 'failed', 'refunded'),
    allowNull: false,
  })
  declare status: 'pending' | 'completed' | 'failed' | 'refunded';

  @Column({ type: DataType.STRING, allowNull: true })
  declare paymentMethod: string | null;

  @Column({ type: DataType.JSONB, allowNull: true })
  declare paymentDetails: Record<string, unknown> | null;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
  })
  declare courseIds: string[];

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => Enrollment)
  declare enrollments: Enrollment[];
}
