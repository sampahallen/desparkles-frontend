export interface MockUser {
  firstName: string;
  email: string;
  role: "customer" | "admin" | "super-admin";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  firstName: string;
  lastName: string;
}
