import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'notifications' })
export class Notification extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare message: string;

  @Column({
    type: DataType.ENUM(
      'course_unlocked',
      'special_offer',
      'payment_confirmation',
      'course_completed',
      'new_lesson',
      'learning_reminder',
      'app_updates',
    ),
    allowNull: false,
  })
  declare type:
    | 'course_unlocked'
    | 'special_offer'
    | 'payment_confirmation'
    | 'course_completed'
    | 'new_lesson'
    | 'learning_reminder'
    | 'app_updates';

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isRead: boolean;

  @Column({ type: DataType.JSONB, allowNull: true })
  declare metadata: Record<string, unknown> | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare actionUrl: string | null;

  @BelongsTo(() => User)
  declare user: User;
}
