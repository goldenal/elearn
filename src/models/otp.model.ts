import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';

@Table({ tableName: 'otps' })
export class OTP extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare phoneOrEmail: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare code: string;

  @Column({
    type: DataType.ENUM('registration', 'login', 'password_reset'),
    allowNull: false,
  })
  declare purpose: 'registration' | 'login' | 'password_reset';

  @Column({ type: DataType.DATE, allowNull: false })
  declare expiresAt: Date;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isVerified: boolean;
}
