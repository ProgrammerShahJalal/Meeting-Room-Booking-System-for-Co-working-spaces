export const USER_ROLE = {
  user: 'user',
  admin: 'admin',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
