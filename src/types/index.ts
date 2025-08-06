// // User types
// export interface User {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: UserRole;
//   avatar?: string;
//   isVerified: boolean;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export enum UserRole {
//   SUPER_ADMIN = 'SUPER_ADMIN',
//   ADMIN = 'ADMIN',
//   INSTRUCTOR = 'INSTRUCTOR',
//   STUDENT = 'STUDENT',
//   GUEST = 'GUEST',
// }

// // Course types
// export interface Course {
//   id: string;
//   title: string;
//   description?: string;
//   thumbnail?: string;
//   price?: number;
//   status: CourseStatus;
//   instructorId: string;
//   categoryId?: string;
//   createdAt: string;
//   updatedAt: string;
//   instructor?: User;
//   category?: Category;
//   modules?: Module[];
//   enrollments?: Enrollment[];
// }

// export enum CourseStatus {
//   DRAFT = 'DRAFT',
//   PUBLISHED = 'PUBLISHED',
//   ARCHIVED = 'ARCHIVED',
// }

// export interface Category {
//   id: string;
//   name: string;
//   description?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// // Module and Lesson types
// export interface Module {
//   id: string;
//   title: string;
//   order: number;
//   courseId: string;
//   createdAt: string;
//   updatedAt: string;
//   lessons?: Lesson[];
// }

// export interface Lesson {
//   id: string;
//   title: string;
//   content?: string;
//   contentType: ContentType;
//   videoUrl?: string;
//   fileUrl?: string;
//   order: number;
//   moduleId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export enum ContentType {
//   VIDEO = 'VIDEO',
//   TEXT = 'TEXT',
//   PDF = 'PDF',
//   QUIZ = 'QUIZ',
//   ASSIGNMENT = 'ASSIGNMENT',
// }

// // Enrollment types
// export interface Enrollment {
//   id: string;
//   userId: string;
//   courseId: string;
//   enrolledAt: string;
//   completedAt?: string;
//   progress: number;
//   user?: User;
//   course?: Course;
// }

// // Assessment types
// export interface Quiz {
//   id: string;
//   title: string;
//   instructions?: string;
//   timeLimit?: number;
//   lessonId: string;
//   createdAt: string;
//   updatedAt: string;
//   questions?: Question[];
// }

// export interface Question {
//   id: string;
//   questionText: string;
//   questionType: QuestionType;
//   options: string[];
//   correctAnswer?: string;
//   points: number;
//   quizId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export enum QuestionType {
//   MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
//   TRUE_FALSE = 'TRUE_FALSE',
//   SHORT_ANSWER = 'SHORT_ANSWER',
//   ESSAY = 'ESSAY',
// }

// export interface QuizAttempt {
//   id: string;
//   userId: string;
//   quizId: string;
//   score?: number;
//   submittedAt: string;
// }

// // Communication types
// export interface Discussion {
//   id: string;
//   title: string;
//   content: string;
//   userId: string;
//   courseId: string;
//   createdAt: string;
//   updatedAt: string;
//   user?: User;
//   course?: Course;
// }

// export interface Message {
//   id: string;
//   senderId: string;
//   recipientId: string;
//   subject?: string;
//   content: string;
//   isRead: boolean;
//   sentAt: string;
//   sender?: User;
//   recipient?: User;
// }

// export interface Notification {
//   id: string;
//   userId: string;
//   type: string;
//   title: string;
//   content: string;
//   isRead: boolean;
//   createdAt: string;
// }

// // API Response types
// export interface ApiResponse<T = any> {
//   success: boolean;
//   message: string;
//   data?: T;
//   meta?: {
//     page?: number;
//     limit?: number;
//     total?: number;
//   };
// }

// export interface PaginatedResponse<T> {
//   data: T[];
//   meta: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// // Auth types
// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface RegisterData {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   role?: UserRole;
// }

// export interface AuthResponse {
//   user: User;
//   accessToken: string;
//   refreshToken: string;
// }
