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

@Table({ tableName: 'certificates' })
export class Certificate extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => Enrollment)
  @Column({ type: DataType.UUID, allowNull: false })
  declare enrollmentId: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare certificateNumber: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare certificateUrl: string | null;

  @Column({ type: DataType.DATE, allowNull: false })
  declare issuedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare expiresAt: Date | null;

  @BelongsTo(() => Enrollment)
  declare enrollment: Enrollment;
}
