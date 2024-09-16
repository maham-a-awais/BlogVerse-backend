// @types
export interface CustomResponse {
  statusCode: number;
  message: string;
  response: string;
  data?: object | string;
  accessToken?: string;
  refreshToken?: string;
}

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface UserAttributes {
  id?: number;
  fullName: string;
  email: string;
  password: string;
  isVerified?: boolean;
  avatarUrl?: string;
  avatarId?: string;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface PostAttributes {
  id?: number;
  title: string;
  body: string;
  minTimeToRead: number;
  image: string;
  thumbnail?: string;
  userId: number;
  categoryId: number;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface CommentAttributes {
  id?: number;
  body: string;
  userId: number;
  postId: number;
  parentCommentId?: number;
}

export interface CategoryAttributes {
  id?: number;
  name: string;
}

export interface PostRequestQuery {
  title: string;
  categoryId: number;
  offset: number;
  limit: number;
}

export interface CommentRequestQuery {
  offset: number;
  limit: number;
}
