const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-300 animate-pulse ${className}`}></div>
  );
  
  // Skeleton for Table Row
  const TableSkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="py-2 px-4 text-center">
        <Skeleton className="h-4 w-4 rounded-full" />
      </td>
      <td className="py-2 px-4 text-center">
        <Skeleton className="h-4 rounded-full" />
      </td>
      <td className="py-2 px-4 text-center">
        <Skeleton className="h-4 rounded-full" />
      </td>
      <td className="py-2 px-4 text-center">
        <Skeleton className="h-4 rounded-full" />
      </td>
    </tr>
  );
  
  const ArticleListSkeleton = () => {
    return (
      
      <div className="product-list bg-white rounded-lg shadow p-4 mb-4">
        {/* Header Skeleton */}
        <Skeleton className="h-6 rounded-full w-48 mb-4" />
  
        {/* Filtering Buttons Skeleton */}
        <div className="mb-4 flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-20 rounded-full" />
          ))}
        </div>
  
        {/* Search Bar Skeleton */}
        <div className="flex mb-4 flex-wrap">
          <Skeleton className="h-10 rounded w-3/4" />
          <Skeleton className="h-10 w-16 rounded ml-4" />
        </div>
  
        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-300 animate-pulse">
                <th className="p-2"></th>
                <th className="py-2 px-4"></th>
                <th className="py-2 px-4"></th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableSkeletonRow key={idx} />
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Pagination Controls Skeleton */}
        <div className="flex space-x-2 mt-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-10 rounded-md" />
          ))}
        </div>
      </div>
    );
  };
  
  export default ArticleListSkeleton;