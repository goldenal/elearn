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

@Table({ tableName: 'messages' })
export class Message extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare senderId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare receiverId: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare content: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isRead: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  declare readAt: Date | null;

  @BelongsTo(() => User, 'senderId')
  declare sender: User;

  @BelongsTo(() => User, 'receiverId')
  declare receiver: User;
}
