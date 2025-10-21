import { CartItem } from './cart-item.model';
import { Cart } from './cart.model';
import { Category } from './category.model';
import { Certificate } from './certificate.model';
import { ChatbotConversation } from './chatbot-conversation.model';
import { CourseModule } from './course-module.model';
import { Course } from './course.model';
import { Enrollment } from './enrollment.model';
import { Lesson } from './lesson.model';
import { Message } from './message.model';
import { Notification } from './notification.model';
import { OTP } from './otp.model';
import { Payment } from './payment.model';
import { Progress } from './progress.model';
import { Review } from './review.model';
import { User } from './user.model';

export const sequelizeModels = [
  User,
  Course,
  Category,
  CourseModule,
  Lesson,
  Enrollment,
  Progress,
  Certificate,
  Review,
  Notification,
  Cart,
  CartItem,
  Payment,
  Message,
  OTP,
  ChatbotConversation,
] as const;

export {
  CartItem,
  Cart,
  Category,
  Certificate,
  ChatbotConversation,
  CourseModule,
  Course,
  Enrollment,
  Lesson,
  Message,
  Notification,
  OTP,
  Payment,
  Progress,
  Review,
  User,
};
