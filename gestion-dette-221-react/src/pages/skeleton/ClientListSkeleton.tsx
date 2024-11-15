const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-300 animate-pulse ${className}`}></div>
  );
  
  // Skeleton for Table Row
  const TableSkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="py-2 px-4 w-30">
        <Skeleton className="h-6 w-full rounded" />
      </td>
      <td className="py-2 px-4 w-30">
        <Skeleton className="h-6 w-full rounded" />
      </td>
      <td className="py-2 px-4 w-30">
        <Skeleton className="h-6 w-full rounded" />
      </td>
      <td className="py-2 px-4 w-30">
        <Skeleton className="h-6 w-full rounded" />
      </td>
      <td className="py-2 px-4 w-30">
        <Skeleton className="h-6 w-full rounded" />
      </td>
    </tr>
  );
  
  // Skeleton for Pagination
  const PaginationSkeleton = () => (
    <div className="flex justify-end mt-4 mb-2 sm:mb-0 space-x-2">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Skeleton key={idx} className="h-10 w-10 rounded-md" />
      ))}
    </div>
  );
  
  // Skeleton for Modal Form

  
  // Main Skeleton
  const ClientSkeleton = () => (
      <div className="product-lists">
        <div className="product-list bg-white rounded-lg shadow p-4 w-full">
          <Skeleton className="h-8 w-1/3 rounded mb-4" />
  
          {/* Filter and Button Skeleton */}
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-28 rounded" />
              <Skeleton className="h-10 w-12 rounded" />
            </div>
            <Skeleton className="h-10 w-40 rounded" />
          </div>
  
          {/* Table Skeleton */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <th key={idx} className="px-6 py-3">
                      <Skeleton className="h-6 w-full rounded" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <TableSkeletonRow key={idx} />
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Pagination Skeleton */}
          <PaginationSkeleton />
        </div>
      </div>
  );
  
  export default ClientSkeleton;
  