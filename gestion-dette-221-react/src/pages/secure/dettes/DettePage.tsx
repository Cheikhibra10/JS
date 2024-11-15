import { useSearchParams } from 'react-router-dom';
import DetteDetailComponent from './components/DetteDetailComponent';
import ClientComponent from './components/ClientComponent';
import DetteComponent from './components/DetteComponent';


export default function DettePage() {
  const [searchParams] = useSearchParams();

  // Check if the 'details' query parameter is present
  const showDetails = searchParams.get('details') !== null;

  return (
    <main className="mt-8 mx-4 md:mx-8 rounded-xl bg-white screene1 p-4 shadow-sm">
      {showDetails ? (
        <DetteDetailComponent />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClientComponent />
          <DetteComponent />
        </div>
      )}
    </main>
  );
}
