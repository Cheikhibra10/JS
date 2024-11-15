import { ReactNode } from "react";
import { Article } from "./article.model";
import { Client } from "./client.model";
import { UserConnect } from "./user.model";

export interface Dette {
  qteVente: ReactNode;
  libelle: ReactNode;
  prixVente: ReactNode;
  id: number;
  date: string;
  montant: number;
  montantVerser: number;
  montantDue: number;
  montantRestant: number;
  createAt: string;
  updatedAt: string;
  client: Client;
  clientId: number;
  articles: Article[];
}


 