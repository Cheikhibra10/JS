import { useEffect, useState } from "react";
import useArticle from "../../../../hooks/useArticle";
import { useArticleContext } from "../../../../utils/ArticleContext";

interface Article {
    id: number | null; // Allow null to match imported type
    libelle: string;
    prix: number;
    qteStock: number;
    // add other fields as necessary
}

interface ArticleListComponentProps {
  articles?: Article[]; // Mark articles as optional
}

export default function ArticleListComponent({ articles: propArticles }: ArticleListComponentProps) {
  const { data: fetchedArticles, error, isLoading } = useArticle();
  
  const { selectedArticles, addArticle, removeArticle } = useArticleContext();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const articlesPerPage = 2;
  const [totalPages, setTotalPages] = useState<number>(0);
  const [libelleFilter, setLibelleFilter] = useState<string>('');
  const [filter, setFilter] = useState<string>('ALL');

  const handleLibelleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLibelleFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSelectArticle = (id: number | null) => {
    if (id === null) return; // Prevent selection of null id
    if (selectedArticles.includes(id)) {
      removeArticle(id);
    } else {
      addArticle(id);
    }
  };

  // Use articles from props if available, otherwise fallback to fetched articles
  const articles = propArticles || fetchedArticles;

const filteredArticles = Array.isArray(articles)
  ? articles.filter(article => {
      switch (filter) {
        case 'RUP':
          return article.qteStock === 0;
        case 'DIS':
          return article.qteStock > 0;
        case 'ALL':
        default:
          return true;
      }
    }).filter(article => {
      const libelle = article.libelle || '';  // Ensure libelle is defined as an empty string if undefined
      const filterText = libelleFilter?.toLowerCase() || '';  // Ensure libelleFilter is a valid string
      return libelle.toLowerCase().includes(filterText);
    })
  : [];


  useEffect(() => {
    setTotalPages(Math.ceil(filteredArticles.length / articlesPerPage));
  }, [filteredArticles]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="product-list bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-2xl text-blue-800 font-bold mb-4">Lister les produits</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 ${filter === 'RUP' ? 'bg-red-500 text-white' : 'bg-red-300 text-white'}`}
          onClick={() => setFilter('RUP')}
        >
          RUP
        </button>
        <button
          className={`px-4 py-2 ${filter === 'DIS' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-white'}`}
          onClick={() => setFilter('DIS')}
        >
          DIS
        </button>
        <button
          className={`px-4 py-2 ${filter === 'ALL' ? 'bg-blue-500 text-white' : 'bg-blue-300 text-white'}`}
          onClick={() => setFilter('ALL')}
        >
          ALL
        </button>
      </div>
      <div className="flex mb-4 flex-wrap">
        <input
          type="text"
          placeholder="libelle"
          value={libelleFilter}
          onChange={handleLibelleChange}
          className="border rounded px-4 py-2 w-3/4"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2 text-center">
                <i className="fas fa-check-square"></i>
              </th>
              <th className="py-2 px-4 text-center">Article</th>
              <th className="py-2 px-4 text-center">Prix</th>
              <th className="py-2 px-4 text-center">Qte en stock</th>
            </tr>
          </thead>
          <tbody>
            {currentArticles.length > 0 ? (
              currentArticles.map((article) => (
                <tr key={article.id || Math.random()}> {/* Use a fallback key if id is null */}
                  <td className="py-2 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.id!)} // Use ! to assert id is not null
                      onChange={() => handleSelectArticle(article.id)}
                    />
                  </td>
                  <td className="py-2 px-4 text-center">{article.libelle}</td>
                  <td className="py-2 px-4 text-center">CFA {article.prix.toFixed(2)}</td>
                  <td className="py-2 px-4 text-center">{article.qteStock}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-2 px-4 text-center">Pas d'articles trouvés</td>
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
    </div>
  );
}
