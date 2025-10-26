import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
  DefaultScope,
} from 'sequelize-typescript';
import { Course } from './course.model';
import { Enrollment } from './enrollment.model';
import { Review } from './review.model';
import { Notification } from './notification.model';

@DefaultScope(() => ({
  attributes: { exclude: ['password'] },
}))
@Table({ tableName: 'users' })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare lastName: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare phone: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare profileImage: string | null;

  @Default('student')
  @Column({
    type: DataType.ENUM('student', 'instructor', 'admin'),
    allowNull: false,
  })
  declare role: 'student' | 'instructor' | 'admin';

  @Column({ type: DataType.STRING, allowNull: true })
  declare bio: string | null;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isVerified: boolean;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isActive: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  declare lastLoginAt: Date | null;

  @HasMany(() => Course, 'instructorId')
  declare coursesCreated: Course[];

  @HasMany(() => Enrollment)
  declare enrollments: Enrollment[];

  @HasMany(() => Review)
  declare reviews: Review[];

  @HasMany(() => Notification)
  declare notifications: Notification[];
}
