import { z } from "zod";

// Define the Zod schema
export const userSchema = z.object({
    nom: z.string().min(1, { message: "Le nom est obligatoire" }),
    prenom: z.string().min(1, { message: "Le prénom est obligatoire" }),
    telephone: z.string().length(9, { message: "Le téléphone doit contenir exactement 9 chiffres" }),
    adresse: z.string().min(1, { message: "L'Adresse est obligatoire" }),
    login: z.string().email({ message: "L'email doit être valide" }),
    password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  });
  

// Validate the form
export const validateForm = (data: any) => {
  try {
    userSchema.parse(data);
    return { isValid: true, errors: {} };  // Return validation success
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      e.errors.forEach((error) => {
        if (error.path.length > 0) {
          errors[error.path[0]] = error.message;
        }
      });
      return { isValid: false, errors }; // Return validation errors
    }
    return { isValid: false, errors: { unknown: "Unknown error occurred" } };
  }
};



const isLibelleUnique = async (value: string, articles: any[]) => {
  return !articles.some(article => article.libelle === value);
};


export const articlePostSchema = (articles: any[]) => z.object({
  libelle: z.string().nonempty({ message: "Le libelle est obligatoire." }).refine(async (value) => {
      const isUnique = await isLibelleUnique(value, articles);
      return isUnique;
  }, {
      message: "Le libelle existe déjà.",
  }),
  prix: z.number().positive({ message: "Le prix doit être positif." }),
  qteStock: z.number().positive({ message: "La quantité en stock doit être positive." }),
});

