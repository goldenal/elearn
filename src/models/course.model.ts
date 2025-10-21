import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Category } from './category.model';
import { CourseModule } from './course-module.model';
import { Enrollment } from './enrollment.model';
import { Review } from './review.model';

@Table({ tableName: 'courses' })
export class Course extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare thumbnail: string | null;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: string;

  @Default(0)
  @Column({ type: DataType.DECIMAL(3, 2), allowNull: false })
  declare discount: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare instructorId: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.UUID, allowNull: false })
  declare categoryId: string;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare totalStudents: number;

  @Default(0)
  @Column({ type: DataType.DECIMAL(2, 1), allowNull: false })
  declare averageRating: string;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare totalReviews: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare totalDurationMinutes: number;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare totalLectures: number;

  @Default('draft')
  @Column({
    type: DataType.ENUM('draft', 'published', 'archived'),
    allowNull: false,
  })
  declare status: 'draft' | 'published' | 'archived';

  @Column({ type: DataType.STRING, allowNull: true })
  declare language: string | null;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  declare subtitles: string[];

  @Column({ type: DataType.STRING, allowNull: true })
  declare level: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare prerequisites: string | null;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  declare tags: string[];

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isBestseller: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isNewRelease: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isHotAndNew: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isFree: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  declare lastUpdated: Date | null;

  @BelongsTo(() => User, 'instructorId')
  declare instructor: User;

  @BelongsTo(() => Category)
  declare category: Category;

  @HasMany(() => CourseModule)
  declare modules: CourseModule[];

  @HasMany(() => Enrollment)
  declare enrollments: Enrollment[];

  @HasMany(() => Review)
  declare reviews: Review[];
}
