export enum KEYS {
  ACCESS_TOKEN = "accessToken",
  REFRESH_TOKEN = "refreshToken",
  PASSWORD_RESET = "passwordReset",
  AUTHORIZATION = "Authorization",
}

export const ERROR_MESSAGES = {
  // User-related messages
  USER: {
    NOT_FOUND: "User not found",
    ALREADY_EXISTS: "User already exists",
    INCORRECT_PASSWORD: "Incorrect password",
    INCORRECT_EMAIL_OR_PASSWORD: "Incorrect email or password",
    INVALID_TOKEN: "Invalid token",
    MAX_ATTEMPTS_EXCEEDED: "Too many login attempts. Please try again later.",
    EMAIL_ALREADY_VERIFIED: "Email already verified ",
    EMAIL_NOT_VERIFIED: "Email not verified",
    COULD_NOT_VERIFY: "User could not be verified",
    CONFIRM_PASSWORD_MISMATCH: "Passwords do not match",
    EMAIL_REQUIRED: "Email is required",
    EMAIL_INVALID: "Invalid email address!",
    EMAIL_ALREADY_EXISTS: "Email already exists",
    SIGN_UP: "Error signing up!",
    LOG_IN: "Error logging in!",
    LOG_OUT: "Error logging out!",
    VERIFY_EMAIL: "Error verifying email!",
    EMAIL_NOT_SENT: "Email could not be sent!",
    PASSWORD_RESET_FAIL: "Password could not be reset!",
    FETCH_USER_ERROR: "Error fetching user!",
    TOKEN: "Error Generating Token!!",
    CHANGING_PASSWORD: "Error changing password!!",
    AUTHORIZATION_FAILED: "Error authenticating user!",
    UNAUTHORIZED: "Unauthorized user!",
  },

  // Post-related messages
  POST: {
    NOT_FOUND: "Post not found",
    CREATION_FAILED: "Failed to create post. Please try again.",
    UPDATE_FAILED: "Failed to update post. Please try again.",
    DELETION_FAILED: "Failed to delete post. Please try again.",
    RETRIEVAL_FAILED: "Failed to retrieve post. Please try again.",
    SEARCH_FAILED: "Failed to search for post. Please try again.",
    ID_REQUIRED: "Post ID is required",
    SEARCH: "Search by title or category",
  },

  // Comment-related messages
  COMMENT: {
    NOT_FOUND: "Comment not found",
    CREATION_FAILED: "Failed to create comment. Please try again.",
    UPDATE_FAILED: "Failed to update comment. Please try again.",
    DELETION_FAILED: "Failed to delete comment. Please try again.",
    RETRIEVAL_FAILED: "Failed to retrieve comments. Please try again.",
    REPLIES_FAILED: "Failed to retrieve replies. Please try again.",
    ID_REQUIRED: "Comment ID is required",
    PARENT_NOT_FOUND: "Parent comment not found",
    NO_COMMENT_FOR_POST: "No Comments for this Post!",
    REPLIES_NOT_FOUND: "Replies not found!",
  },

  TOKEN: {
    SIGN: "Unable to sign token",
    VERIFY: "Unable to verify token",
  },

  // Generic errors
  INTERNAL_SERVER_ERROR: "An internal server error occurred",
  FORBIDDEN: "You don't have permission to perform this action",
  DATABASE_ERROR: "Error connecting to database! ",
  ERROR: "ERROR!",
};

export const SUCCESS_MESSAGES = {
  // User-related messages
  USER: {
    FOUND: "User found!",
    CREATED: "User created successfully",
    UPDATED: "User updated!",
    DELETED: "User Deleted Successfully!",
    LOG_OUT: "Logout Successful! ",
    LOGGED_IN: "User logged in successfully ",
    NEW_TOKEN: "New token generated!",
    RESET_EMAIL_SENT: "Password reset email sent successfully! Please check your inbox",
    PASSWORD_RESET_SUCCESS: "Password reset successful!",
    PASSWORD_CHANGED: "Password changed successfully!",
    EMAIL_VERIFIED: "Email verified successfully ",
    VERIFY_EMAIL: "Please verify your email",
    PLEASE_LOG_IN: "Please login to your account",
    EMAIL_SENT: "Email sent successfully! ",
  },

  // Post-related messages
  POST: {
    CREATED: "Post created successfully",
    RETRIEVED: "Posts retrieved successfully",
    UPDATED: "Post updated successfully",
    DELETED: "Post deleted successfully",
  },

  // Comment-related messages
  COMMENT: {
    CREATED: "Comment created successfully",
    RETRIEVED: "Comments retrieved successfully",
    UPDATED: "Comment updated successfully",
    DELETED: "Comment deleted successfully",
    REPLIES: "Replies found!",
  },

  DATABASE_CONN: "Database connected!",
  SERVER: "Server is listening on port ",
  SUCCESS: "SUCCESS!",
};

export const VALIDATION_KEYS = {
  EMPTY_STRING_KEY: "string.empty",
  REQUIRE_KEY: "any.require",
  EMAIL_FORMAT_KEY: "string.email",
  PASSWORD_PATTERN_KEY: "string.pattern.base",
  EMPTY_NUMBER: "number.empty",
};

export const USER_VALIDATION = {
  EMPTY_NAME: "Please enter your full name",
  REQUIRED_NAME: "Full Name is required",
  EMPTY_EMAIL: "Email cannot be empty",
  REQUIRED_EMAIL: "Email is required",
  INVALID_EMAIL: "Invalid email address",
  EMPTY_PASSWORD: "Password cannot be empty",
  PASSWORD_PATTERN:
    "Password must contain only letters, numbers, or special characters and be between 8 and 30 characters long.",
  EMPTY_OLD_PASSWORD: "Please enter your old password",
  REQUIRED_OLD_PASSWORD: "Old password is required",
  PASSWORD_REGEXP: "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$",
};

export const POST_VALIDATION = {
  EMPTY_TITLE: "Please enter a title for your post",
  REQUIRED_TITLE: "Title is required",
  EMPTY_BODY: "Post body cannot be empty",
  REQUIRED_BODY: "Post body is required",
  EMPTY_MIN_TIME: "Minimum time to read cannot be empty",
  REQUIRED_MIN_TIME: "Minimum time to read is required",
  EMPTY_CATEGORY: "Category cannot be empty",
  REQUIRED_CATEGORY: "Category is required",
};

export const COMMENT_VALIDATION = {
  EMPTY_COMMENT: "Please enter a comment",
  REQUIRED_COMMENT: "Comment is required",
};

export const GENERAL_INFO = {
  EMAIL_SERVICE: "Gmail",
};
