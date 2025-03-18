export interface User {
  id: number;
  name: string;
  email: string;
  organizationId: number;
  organizationName?: string;
  classInfo?: string;
  createdAt?: string;
  role: string;
}