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

@Table({ tableName: 'chatbot_conversations' })
export class ChatbotConversation extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare question: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare answer: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  declare context: Record<string, unknown> | null;

  @BelongsTo(() => User)
  declare user: User;
}
