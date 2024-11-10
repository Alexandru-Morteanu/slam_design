import { Profile, User } from "next-auth";

export type RegisterForm = {
  username: string;
  phoneNumber: string;
  user?: User;
  profile?: Profile;
};
export type Orders = {
  id?: number;
  email: string;
  membership: string;
  adress: string;
  est_time: string;
  est_price: number;
  timestamp: number;
  status: string;
};

export type Printers = {
  id?: number;
  name: string;
  status: boolean;
  curentOrder: string;
  speed: number;
  finishTime: number;
};
