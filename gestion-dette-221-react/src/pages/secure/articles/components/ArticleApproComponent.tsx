import React, { useState, useEffect } from 'react';
import { useArticleContext } from '../../../../utils/ArticleContext';
import useArticle from '../../../../hooks/useArticle';
import { authService } from '../../../../services/AuthService';
import apiClient from '../../../../services/api-client';

export default function ArticleApproComponent() {
  const { data: articles = [], refetch} = useArticle(); // Get articles using the custom hook
  const { selectedArticles, removeArticle, updateQuantity, quantities, clearAllArticles, total } = useArticleContext();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const articlesPerPage = 2;
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    setTotalPages(Math.ceil(selectedArticles.length / articlesPerPage));
  }, [selectedArticles]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = Array.isArray(articles)
    ? articles.filter(article => selectedArticles.includes(article.id)).slice(startIndex, endIndex)
    : [];

  const handleQuantityChange = (articleId: number, newQuantity: number) => {
    const updatedQuantity = Math.max(1, newQuantity);
    updateQuantity(articleId, updatedQuantity);
  };

  const saveQuantities = async () => {
    try {
      const updatePromises = currentArticles.map(article => {
        const updatedStock = quantities[article.id] || 1;
        const token = authService.getToken();
        return apiClient.patch(
          `/articles/${article.id}/stock`,
          { qteStock: updatedStock },
          {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
          }
        );
      });

      await Promise.all(updatePromises); // Wait for all updates to complete
      refetch();
      clearAllArticles();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };


  return (
    <div className="product-list bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4 flex-wrap">
        <h3 className="text-xl text-blue-800 font-bold mb-2 sm:mb-0">Liste de produits sélectionnés</h3>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Total:</label>
        <input
          type="text"
          value={`CFA ${total.toFixed(2)}`}
          className="border rounded px-4 py-2 w-full"
          readOnly
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 text-center">ARTICLE</th>
              <th className="py-2 px-4 text-center">PRIX</th>
              <th className="py-2 px-4 text-center">QUANTITÉ</th>
              <th className="py-2 px-4 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentArticles.length > 0 ? (
              currentArticles.map(article => (
                <tr key={article.id}>
                  <td className="py-2 px-4 text-center">{article.libelle}</td>
                  <td className="py-2 px-4 text-center">CFA {article.prix.toFixed(2)}</td>
                  <td className="py-2 px-4 text-center">
                  <input
                    type="number"
                    className="border rounded px-2 py-1 text-center w-16"
                    value={quantities[article.id] || 1}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value, 10);
                      handleQuantityChange(article.id, isNaN(newQuantity) ? 1 : newQuantity);
                    }}
                    min={1} // Minimum is 1, but no maximum restriction
                  />

                </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      className="text-red-500"
                      onClick={() => removeArticle(article.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-2 px-4 text-center">Aucun article sélectionné</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {currentArticles.length > 0 && (
        <div className="w-full h-12 flex justify-between mt-4 flex-wrap">
          <div className="flex justify-center mt-4 mb-2 sm:mb-0">
            <button
              className="px-3 py-1 border rounded mr-1"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Précédent
            </button>
            <span className="px-3 py-1 border rounded">{currentPage}</span>
            <button
              className="px-3 py-1 border rounded ml-1"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
      <br />
      <button
        className="rounded-lg border bg-blue border-blue-500 bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-blue-700 hover:bg-blue-700 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-blue-300 disabled:bg-blue-300"
        onClick={saveQuantities}
      >
        VALIDER
      </button>
    </div>
  );
}
