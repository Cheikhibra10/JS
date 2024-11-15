import { createContext, useContext, useState, useMemo } from 'react';
import useArticle from '../hooks/useArticle';

interface ArticleContextType {
  selectedArticles: number[];
  quantities: Record<number, number>;
  addArticle: (articleId: number) => void;
  removeArticle: (articleId: number) => void;
  updateQuantity: (articleId: number, quantity: number) => void;
  clearAllArticles: () => void;
  total: number; // Add this line
}

const ArticleContext = createContext<ArticleContextType | null>(null);

export function ArticleProvider({ children }: { children: React.ReactNode }) {
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { data: articles } = useArticle();

  const addArticle = (articleId: number) => {
    if (!selectedArticles.includes(articleId)) {
      setSelectedArticles([...selectedArticles, articleId]);
    }
  };

  const removeArticle = (articleId: number) => {
    setSelectedArticles(selectedArticles.filter(id => id !== articleId));
    setQuantities(prev => {
      const { [articleId]: _, ...newQuantities } = prev;
      return newQuantities;
    });
  };

  const updateQuantity = (articleId: number, quantity: number) => {
    setQuantities({
      ...quantities,
      [articleId]: quantity,
    });
  };

  const clearAllArticles = () => {
    setSelectedArticles([]);
    setQuantities({});
  };

  // Calculate total amount based on selected articles and quantities
  const total = useMemo(() => {
    return selectedArticles.reduce((acc, articleId) => {
      const quantity = quantities[articleId] || 1; // Default to 1 if quantity is not set
      const articlePrice = articles?.find(article => article.id === articleId)?.prix || 0; // Assuming 'articles' is accessible
      return acc + (articlePrice * quantity);
    }, 0);
  }, [selectedArticles, quantities, articles]);

  return (
    <ArticleContext.Provider value={{
      selectedArticles,
      quantities,
      addArticle,
      removeArticle,
      updateQuantity,
      clearAllArticles,
      total, // Provide total in context
    }}>
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticleContext() {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticleContext must be used within an ArticleProvider');
  }
  return context;
}
