import { mockRequest } from "./mockClient";
import type { LoginPayload, MockUser, RegisterPayload } from "../types/auth";

const MOCK_USER: MockUser = {
  firstName: "Akosua",
  email: "akosua@example.com",
  role: "customer",
};

export const authService = {
  login: async (_payload: LoginPayload) => mockRequest(MOCK_USER),
  register: async (_payload: RegisterPayload) => mockRequest(MOCK_USER),
  logout: async () => mockRequest({ success: true }),
  profile: async () => mockRequest(MOCK_USER),
};
