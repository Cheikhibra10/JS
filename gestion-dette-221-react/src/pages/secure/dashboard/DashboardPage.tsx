import { useArticleQteStock } from "../../../hooks/useArticle";
import { useTotalClient } from "../../../hooks/useClient";
import { useDetteDemandesEnCours, useTotalDettes } from "../../../hooks/useDette"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';


export default function DashboardPage(){
  const { data: totalDette, isLoading: loadingDette } = useTotalDettes();
  const { data: totalDemandeCours, isLoading: loadingDemande } = useDetteDemandesEnCours();
  const { data: totalClients, isLoading: loadingClients } = useTotalClient();
  const { data: totalArticleQteStock, isLoading: loadingArticles } = useArticleQteStock();
  const data = [
    { name: 'Total Dettes', value: totalDette?.data !== undefined && totalDette?.data !== null
      ? totalDette.data
      : totalDette || 0 },
    { name: 'Nombre de Clients', value: totalClients?.data !== undefined && totalClients?.data !== null
      ? totalClients.data
      : totalClients || 0},
    { name: 'Articles en Stock', value: totalArticleQteStock?.data !== undefined && totalArticleQteStock?.data !== null
      ? totalArticleQteStock.data
      : totalArticleQteStock || 0},
    { name: 'Demandes en Cours', value: totalDemandeCours?.data !== undefined && totalDemandeCours?.data !== null
      ? totalDemandeCours.data
      : totalDemandeCours || 0}
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <main className="mt-8 mx-4 md:mr-8 rounded-xl bg-white p-4 shadow-sm flex flex-col">
      <div className="p-8" style={{ background: 'linear-gradient(to right, #2b6cb0, #2d3748' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ height: "80%" }}>
          
          <div className="stat-card rounded-lg p-6 text-white h-40">
            <div className="flex items-center mb-4">
              <div className="stat-icon w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-money-bill-wave text-xl"></i>
              </div>
              <h3 className="text-base font-semibold">Total Dettes</h3>
            </div>
            <p className="text-3xl font-bold mb-2">
              {totalDette?.data !== undefined && totalDette?.data !== null
                ? totalDette.data
                : totalDette || 0} FCFA
            </p>

            <div className="flex items-center text-sm">
              <i className="fas fa-arrow-up mr-1 text-green-400"></i>
            </div>
          </div>

          <div className="stat-card rounded-lg p-6 text-white h-40">
            <div className="flex items-center mb-4">
              <div className="stat-icon w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-users text-xl"></i>
              </div>
              <h3 className="text-base font-semibold">Nombre de Clients</h3>
            </div>
            <p className="text-3xl font-bold mb-2">
              {totalClients?.data !== undefined && totalClients?.data !== null
                ? totalClients.data
                : totalClients || 0} Clients
            </p>

            <div className="flex items-center text-sm">
              <i className="fas fa-arrow-up mr-1 text-green-400"></i>
            </div>
          </div>

          <div className="stat-card rounded-lg p-6 text-white h-40">
            <div className="flex items-center mb-4">
              <div className="stat-icon w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-boxes text-xl"></i>
              </div>
              <h3 className="text-base font-semibold">Articles en Stock</h3>
            </div>
            <p className="text-3xl font-bold mb-2">
              {totalArticleQteStock?.data !== undefined && totalArticleQteStock?.data !== null
                ? totalArticleQteStock.data
                : totalArticleQteStock || 0} Articles en Stock
            </p>

            <div className="flex items-center text-sm">
              <i className="fas fa-arrow-up mr-1 text-green-400"></i>
            </div>
          </div>

          <div className="stat-card rounded-lg p-6 text-white h-40 ">
            <div className="flex items-center mb-4">
              <div className="stat-icon w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-hand-holding-usd text-xl"></i>
              </div>
              <h3 className="text-base font-semibold">Demandes en Cours</h3>
            </div>
            <p className="text-3xl font-bold mb-2">
              {totalDemandeCours?.data !== undefined && totalDemandeCours?.data !== null
                ? totalDemandeCours.data
                : totalDemandeCours || 0} Demandes en Cours
            </p>
            <div className="flex items-center text-sm">
              <i className="fas fa-arrow-up mr-1 text-green-400"></i>
            </div>
          </div>
           
        </div>
      </div> 
         {/* Pie Chart */}
         <div className="col-span-2 flex justify-center items-center">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
    <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Liste des Clients
            </h2>
            <div className="overflow-x-auto">
              <table className="bg-white shadow-lg rounded-lg w-full">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-center">Nom</th>
                    <th className="py-3 px-6 text-center">Prénom</th>
                    <th className="py-3 px-6 text-center">Telephone</th>
                    <th className="py-3 px-6 text-center">Montant Dette</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-6 text-center">John</td>
                    <td className="py-3 px-6 text-center">Doe</td>
                    <td className="py-3 px-6 text-center">77 123 45 67</td>
                    <td className="py-3 px-6 text-center">45000 FCFA</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-center">Amina</td>
                    <td className="py-3 px-6 text-center">Diop</td>
                    <td className="py-3 px-6 text-center">78 987 65 43</td>
                    <td className="py-3 px-6 text-center">35000 FCFA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Articles en Rupture de Stock
            </h2>
            <div className="overflow-x-auto">
              <table className="bg-white shadow-lg rounded-lg w-full">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-center">Article</th>
                    <th className="py-3 px-6 text-center">Quantité Restante</th>
                    <th className="py-3 px-6 text-center">prix</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-6 text-center">Savon</td>
                    <td className="py-3 px-6 text-center">0</td>
                    <td className="py-3 px-6 text-center">300 FCFA</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-center">Shampooing</td>
                    <td className="py-3 px-6 text-center">2</td>
                    <td className="py-3 px-6 text-center">2020 FCFA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    )
}