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
import { CourseModule } from './course-module.model';
import { Progress } from './progress.model';

@Table({ tableName: 'lessons' })
export class Lesson extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => CourseModule)
  @Column({ type: DataType.UUID, allowNull: false })
  declare moduleId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({
    type: DataType.ENUM('video', 'article', 'quiz', 'assignment'),
    allowNull: false,
  })
  declare type: 'video' | 'article' | 'quiz' | 'assignment';

  @Column({ type: DataType.STRING, allowNull: true })
  declare videoUrl: string | null;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare durationMinutes: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare orderIndex: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare content: string | null;

  @Column({ type: DataType.JSONB, allowNull: true })
  declare resources: Record<string, unknown> | null;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isFree: boolean;

  @BelongsTo(() => CourseModule)
  declare module: CourseModule;

  @HasMany(() => Progress)
  declare progress: Progress[];
}
