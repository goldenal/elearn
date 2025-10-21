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
import { Course } from './course.model';
import { Lesson } from './lesson.model';

@Table({ tableName: 'course_modules' })
export class CourseModule extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => Course)
  @Column({ type: DataType.UUID, allowNull: false })
  declare courseId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare orderIndex: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare durationMinutes: number;

  @BelongsTo(() => Course)
  declare course: Course;

  @HasMany(() => Lesson)
  declare lessons: Lesson[];
}
