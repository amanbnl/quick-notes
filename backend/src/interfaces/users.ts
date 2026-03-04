export interface ICreateUser {
  email: string
  password: string
  fullName?: string
}

export interface IUpdateUser {
  fullName: string
  age: number
}

export interface IUpdateUserDetails {
  id: string 
}

export interface IResetPassword {
  oldPassword: string
  newPassword: string
  confirmPassword: string
  userId: string
}

export interface IforgotPassword {
  email?: string
  newPassword?: string
  confirmPassword?: string
  userId?: string
}