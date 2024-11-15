import React, { FormEvent, useEffect, useState } from "react";
import "./ArticlePage.css";
import { z } from 'zod';
import ArticleApproComponent from "./components/ArticleApproComponent";
import ArticleListComponent from "./components/ArticleListComponent";
import ArticleApproSkeleton from "../../skeleton/ArticleApproSkeleton";
import ArticleListSkeleton from "../../skeleton/ArticleListSkeleton";
import axiosFetch from "../../../hooks/axios.fetch";
import { articlePostSchema } from "../../../utils/ValidationSchema";
import useArticle from "../../../hooks/useArticle";
import { Article } from "../../../models/article.model";


interface FormErrors {
    libelle?: string;
    prix?: string;
    qteStock?: string;
}

export default function ArticlePage() {
    const { data: articles = [], refetch} = useArticle(); // Get articles using the custom hook
    const [libelle, setLibelle] = useState('');
    const [prix, setPrix] = useState('');
    const [qteStock, setQteStock] = useState('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [message, setMessage] = useState('');
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const { mutate: createArticle, isLoading} = axiosFetch.usePost<Article>(
      '/articles',
      {
          headers: {
              'Content-Type': 'application/json',
          },
      },
      {
          // Update state when the article is successfully created
           onSuccess: () => {
            refetch();  // Re-fetch articles to update the list
            setLibelle('');  // Reset the form fields
            setPrix('');
            setQteStock('');
            closeModal();    // Close the modal after submission
            showNotification("L'article a été successivement ajouté");
        }
        ,
      }
  );

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setFormErrors({}); // Clear previous errors

  const parsedPrix = parseFloat(prix);
  const parsedQteStock = parseInt(qteStock, 10);

  const newErrors: FormErrors = {};

  // Validate fields
  if (!libelle) {
    newErrors.libelle = 'Le libelle est obligatoire.';
  }
  if (isNaN(parsedPrix)) {
    newErrors.prix = 'Le prix est obligatoire et doit être un nombre valide.';
  }
  if (isNaN(parsedQteStock)) {
    newErrors.qteStock = 'La quantité est obligatoire et doit être un nombre valide.';
  }

  const libelleExists = articles.some((article) => article.libelle === libelle);
  if (libelleExists) {
    newErrors.libelle = 'Le libelle existe déjà.';
  }

  if (Object.keys(newErrors).length > 0) {
    setFormErrors(newErrors);
    return;
  }

  const articleData = {
    libelle,
    prix: parsedPrix,
    qteStock: parsedQteStock,
  };

  try {
    // Zod validation before proceeding
    await articlePostSchema(articles).parseAsync(articleData);
    createArticle(articleData);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationErrors = err.errors.reduce((acc, error) => {
        if (error.path.length > 0) {
          acc[error.path[0]] = error.message;
        }
        return acc;
      }, {} as Record<string, string>);
      setFormErrors(validationErrors); // Set validation errors
    } else {
      console.error('Error:', err);
    }
  }
};
    
    const showNotification = (msg: string) => {
        setMessage(msg);
        setIsMessageVisible(true);
        setTimeout(() => {
          setIsMessageVisible(false);
          setMessage('');
        }, 5000); // Hide message after 3 seconds
      };

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isArticleListLoading, setIsArticleListLoading] = useState<boolean>(true);
    const [isArticleApproLoading, setIsArticleApproLoading] = useState<boolean>(true);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        setTimeout(() => setIsArticleListLoading(false), 2000);
        setTimeout(() => setIsArticleApproLoading(false), 2000);
    }, []);
    return (
        <main className="mt-8 mx-4 md:mr-8 rounded-xl bg-white p-4 shadow-sm screene flex flex-col main-content">
        {isMessageVisible && (
        <div className="flex rounded-md bg-green-50 notification p-4 text-sm text-green-500 fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-3 h-5 w-5 flex-shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <div><b>Success alert: </b>{message}</div>
        </div>
        )}
            <div className="mb-4 flex justify-between flex-wrap">
                <span className="text-blue-800 text-xl font-bold mb-2 sm:mb-0">Approvisionnement</span>
                <button
                    className="rounded-lg border bg-blue border-blue-500 bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-blue-700 hover:bg-blue-700 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-blue-300 disabled:bg-blue-300"
                    onClick={openModal}
                >
                    Nouvelle Article
                </button>
            </div>

            {isModalOpen && (
                <div
                    id="articleModal"
                    tabIndex="-1"
                    aria-hidden={!isModalOpen}
                    className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto h-full bg-black bg-opacity-50 flex items-center justify-center"
                >
                    <div className="relative bg-white rounded-lg shadow w-1/3">
                        <div className="flex justify-between items-center p-4 border-b rounded-t">
                            <h3 className="text-xl font-semibold text-gray-900">Nouvelle Article</h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                onClick={closeModal}
                            >
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </button>
                        </div>

                        <form className="p-6 space-y-6 modal-body" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="libelle" className="block text-sm font-medium text-gray-700">
                                    Libelle
                                </label>
                                <input
                                    type="text"
                                    id="libelle"
                                    value={libelle}
                                    onChange={(e) => setLibelle(e.target.value)}
                                    className="block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                {formErrors.libelle && <p className="text-red-500">{formErrors.libelle}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="prixUnitaire" className="block text-sm font-medium text-gray-700">
                                    Prix Unitaire
                                </label>
                                <input
                                    type="text"
                                    id="prixUnitaire"
                                    value={prix}
                                    onChange={(e) => setPrix(e.target.value)}
                                    className="block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                {formErrors.prix && <p className="text-red-500">{formErrors.prix}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="quantite" className="block text-sm font-medium text-gray-700">
                                    Quantité
                                </label>
                                <input
                                    type="number"
                                    id="quantite"
                                    value={qteStock}
                                    onChange={(e) => setQteStock(e.target.value)}
                                    className="block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                {formErrors.qteStock && <p className="text-red-500">{formErrors.qteStock}</p>}
                            </div>

                            <div className="flex justify-end p-6 space-x-2 border-t modal-footer">
                                <button
                                    type="button"
                                    className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg text-sm px-5 py-2.5"
                                    onClick={closeModal}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5"
                                >
                                    {isLoading? 'Envoi en cours...':'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="product-lists">
            {isArticleListLoading ? <ArticleListSkeleton /> : <ArticleListComponent articles={articles} />}
            {isArticleApproLoading ? <ArticleApproSkeleton /> : <ArticleApproComponent />}
            </div>
        </main>
    );
}
