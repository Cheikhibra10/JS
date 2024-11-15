import { Dette } from "./dette.model";
import { UserConnect } from "./user.model";

export interface Client {
  length: number;
  role: string;
  email: string;
  id: number;
  prenom: string;
  nom: string;
  telephone: string;
  adresse: string;
  photo: string;
  user: string;
  categorieId: number;
  max_montant: number;
  montantDue: number; // Directly on the client object
  montant: number; // Directly on the client object
  montantVerser: number; // Directly on the client object
  detteId: number; // Directly on the client object
  date: string;
  users: UserConnect[];
  dettes?: Dette[];  // Include dettes array
  clientId: number | null; // User can have a clientId or be null
  userCount: any[];
}
