export type Role = "user" | "admin" | "deliverypartner";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  phoneNumber?: string;
};

export type Session = {
  token: string;
  role: Role;
  user?: AuthUser;
};
