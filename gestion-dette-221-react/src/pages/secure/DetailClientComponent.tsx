import { useClientDettesDetails } from "../../hooks/useDette";
import useArticle from "../../hooks/useArticle";

export default function DetailClientComponent() {
  const { data, error, isLoading } = useClientDettesDetails();
  const { data: details, error: articleError, isLoading: articleLoading } = useArticle();
  
  console.log('Article Details:', details);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching dettes: {error.message}</p>;
  }

  if (articleLoading) {
    return <p>Loading articles...</p>;
  }

  if (articleError) {
    return <p>Error fetching articles: {articleError.message}</p>;
  }


  if (!data || data.length === 0) {
    return <div>No dettes found</div>;
  }

  const client = data[0]?.client;
  const clientEmail = client?.email || 'N/A';
  const articles = data[0]?.articles;

  console.log('Client Articles:', articles);


  const totalMontantDue = data.reduce((sum, dette) => sum + (dette.montantDue || 0), 0);
  const totalMontantVerser = data.reduce((sum, dette) => sum + (dette.montantVerser || 0), 0);
  const totalMontantRestant = totalMontantDue - totalMontantVerser;

  return (
    <main className="mt-8 mx-4 md:mr-8 rounded-xl bg-white p-4 shadow-sm flex flex-col">
      {/* User Info and Debt Summary */}
      <div
        className="p-4 sm:p-6 md:p-8 mb-8"
        style={{ background: "linear-gradient(to right, #2b6cb0, #2d3748)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Carte Total des Dettes */}
          <div className="stat-card rounded-lg p-4 sm:p-6 text-white font-semibold text-lg sm:text-xl md:text-2xl flex flex-col justify-between">
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8">
                {client?.photo ? (
                  <img
                    src={client.photo || 'https://via.placeholder.com/150'}
                    alt="Client Photo"
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full"
                  />
                ) : (
                  <i className="fas fa-user-circle text-4xl sm:text-6xl text-gray-500"></i>
                )}
                <div className="flex flex-col justify-between h-full pb-4 text-center sm:text-left">
                  <p>Prenom: {client?.prenom || 'N/A'}</p>
                  <p>Nom: {client?.nom || 'N/A'}</p>
                  <p>Tel: {client?.telephone || 'N/A'}</p>
                </div>
              </div>
              <p className="email text-center sm:text-left">Email: {clientEmail}</p>
            </div>
          </div>
          {/* Carte Demandes en Cours */}
          <div className="stat-card rounded-lg p-4 sm:p-6 font-semibold text-white text-lg sm:text-xl md:text-3xl flex flex-col justify-between">
            <p>Montant Total: {totalMontantDue || 0} FCFA</p>
            <p>Montant Versé: {totalMontantVerser || 0} FCFA</p>
            <p>Montant Restant: {totalMontantRestant || 0} FCFA</p>
          </div>
        </div>
      </div>
    </main>
  );
}
