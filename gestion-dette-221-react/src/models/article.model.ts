import { Key, ReactNode } from "react";

export interface Article {
    prix: number;
    articleId: number;
    libelle: ReactNode;
    qteStock: number;
    id: Key | null | undefined;
    article: {
      id: number;
      libelle: string;
      qteStock: number;
      prix: number;
    };
    qteVente: number;
    prixVente: number;
  }
  

