export interface User {
  id: string;
  phone_number: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  gender?: string | null;
  createdAt?: string;
}
