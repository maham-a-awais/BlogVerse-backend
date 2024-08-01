module.exports = {
  ERROR_MESSAGES: {
    // User-related messages
    USER: {
      NOT_FOUND: "User not found",
      ALREADY_EXISTS: "User already exists",
      INCORRECT_PASSWORD: "Incorrect password",
      INCORRECT_EMAIL_OR_PASSWORD: "Incorrect email or password",
      INVALID_TOKEN: "Invalid token",
      MAX_ATTEMPTS_EXCEEDED: "Too many login attempts. Please try again later.",
      EMAIL_ALREADY_VERIFIED: "Email already verified",
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
      ID_REQUIRED: "Comment ID is required",
      INVALID_PARENT_COMMENT_ID: "Parent comment not found",
    },
    // Generic errors
    INTERNAL_SERVER_ERROR: "An internal server error occurred",
    FORBIDDEN: "You don't have permission to perform this action",
  },
  SUCCESS_MESSAGES: {
    // User-related messages
    USER: {
      FOUND: "User found!",
      CREATED: "User created successfully",
      UPDATED: "User updated!",
      DELETED: "User Deleted Successfully!",
      LOG_OUT: "Logout Successful!",
      LOGGED_IN: "User logged in successfully",
      NEW_TOKEN: "New token generated!",
      RESET_EMAIL_SENT:
        "Password reset email sent successfully! Please check your inbox",
      PASSWORD_RESET_SUCCESS: "Password reset successful!",
      PASSWORD_CHANGED: "Password changed successfully!",
      EMAIL_VERIFIED: "Email verified successfully",
      VERIFY_EMAIL: "Please verify your email",
      PLEASE_LOG_IN: "Please login to your account",
      // EMAIL_SENT: "Email sent successfully! ",
    },
    // Post-related messages
    POST: {
      CREATED: "Post created successfully",
      RETRIEVED: "Posts retrieved successfully",
      RETRIEVED: "Post retrieved successfully",
      UPDATED: "Post updated successfully",
      DELETED: "Post deleted successfully",
    },
    // Comment-related messages
    COMMENT: {
      CREATED: "Comment created successfully",
      RETRIEVED: "Comments retrieved successfully",
      UPDATED: "Comment updated successfully",
      DELETED: "Comment deleted successfully",
    },
  },
  PASSWORD_PATTERN: {
    REGEXP:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
};
