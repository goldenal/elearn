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
import { Cart } from './cart.model';
import { Course } from './course.model';

@Table({ tableName: 'cart_items' })
export class CartItem extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => Cart)
  @Column({ type: DataType.UUID, allowNull: false })
  declare cartId: string;

  @ForeignKey(() => Course)
  @Column({ type: DataType.UUID, allowNull: false })
  declare courseId: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: string;

  @BelongsTo(() => Cart)
  declare cart: Cart;

  @BelongsTo(() => Course)
  declare course: Course;
}
