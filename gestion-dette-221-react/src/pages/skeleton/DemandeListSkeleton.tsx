const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-300 animate-pulse ${className}`}></div>
  );
  
  // Skeleton for Table Row
  const TableSkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="border-t border-gray-200 py-2 px-4">
        <Skeleton className="h-6 w-full rounded" />
      </td>
      <td className="border-t border-gray-200 py-2 px-4">
        <Skeleton className="h-6 w-full rounded" />
      </td>
      <td className="border-t border-gray-200 py-2 px-4">
        <Skeleton className="h-6 w-full rounded" />
      </td>
      <td className="border-t border-gray-200 py-2 px-4">
        <Skeleton className="h-6 w-full rounded" />
      </td>
    </tr>
  );
  
  // Skeleton for Pagination
  const PaginationSkeleton = () => (
    <div className="flex justify-center mt-4 mb-2 sm:mb-0 space-x-2">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Skeleton key={idx} className="h-10 w-10 rounded-md" />
      ))}
    </div>
  );
  
  // Main Skeleton
  const DemandListSkeleton = () => (
      <div className="product-lists">
        <div className="product-list bg-white rounded-lg shadow p-4 w-full">
          {/* Title Skeleton */}
          <Skeleton className="h-8 w-1/3 rounded mb-4" />
  
          {/* Filter and Status Skeleton */}
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-10 w-40 rounded" />
            <div className="flex items-center">
              <label htmlFor="status" className="mr-2">
                <Skeleton className="h-6 w-20 rounded" />
              </label>
              <Skeleton className="h-10 w-32 rounded" />
            </div>
          </div>
  
          {/* Table Skeleton */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {["DATE", "MONTANT", "NOM COMPLET", "ACTION"].map((header, idx) => (
                    <th key={idx} className="py-2 px-4 text-center">
                      <Skeleton className="h-6 w-full rounded" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <TableSkeletonRow key={idx} />
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Pagination Skeleton */}
          <div className="w-full h-12 flex justify-between mt-4 flex-wrap">
            <PaginationSkeleton />
          </div>
        </div>
      </div>
  );
  
  export default DemandListSkeleton;
  