import { Client } from "./client.model";

// Example user model
export interface UserConnect {
  id: number;
  login: string | null; // Allow login to be null
  role: string | null; // Allow role to be null
  clientId: number | null; // User can have a clientId or be null
  client?: {
    categorieId: number;
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    photo: string
  };
  userCount: number; // Assuming you have a user count property
}

  

export type UserConnectOrNull = UserConnect | null;
