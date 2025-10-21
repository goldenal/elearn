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
import { Enrollment } from './enrollment.model';
import { Lesson } from './lesson.model';

@Table({ tableName: 'progress' })
export class Progress extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => Enrollment)
  @Column({ type: DataType.UUID, allowNull: false })
  declare enrollmentId: string;

  @ForeignKey(() => Lesson)
  @Column({ type: DataType.UUID, allowNull: false })
  declare lessonId: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isCompleted: boolean;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare watchedMinutes: number;

  @Column({ type: DataType.DATE, allowNull: true })
  declare completedAt: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare lastAccessedAt: Date | null;

  @BelongsTo(() => Enrollment)
  declare enrollment: Enrollment;

  @BelongsTo(() => Lesson)
  declare lesson: Lesson;
}
