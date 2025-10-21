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
import { Course } from './course.model';

@Table({ tableName: 'reviews' })
export class Review extends Model {
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

  @Column({ type: DataType.DECIMAL(2, 1), allowNull: false })
  declare rating: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare comment: string | null;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isPublished: boolean;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Course)
  declare course: Course;
}
