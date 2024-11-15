const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-300 animate-pulse ${className}`}></div>
  );
  
  // Skeleton for Table Row
  const TableSkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="border-t border-gray-200 py-2 px-4 text-center">
        <Skeleton className="h-6 w-full rounded" />
      </td>
      <td className="border-t border-gray-200 py-2 px-4 text-center">
        <Skeleton className="h-6 w-full rounded" />
      </td>
      <td className="border-t border-gray-200 py-2 px-4 text-center">
        <Skeleton className="h-6 w-full rounded" />
      </td>
      <td className="border-t border-gray-200 py-2 px-4 text-center">
        <Skeleton className="h-6 w-full rounded" />
      </td>
      <td className="border-t border-gray-200 w-11 py-2 px-4 text-center">
        <div className="flex justify-center space-x-1">
          <Skeleton className="h-8 w-10 rounded" />
          <Skeleton className="h-8 w-10 rounded" />
        </div>
      </td>
    </tr>
  );
  
  // Skeleton for Pagination
  const PaginationSkeleton = () => (
    <div className="flex justify-center mt-4 space-x-1">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Skeleton key={idx} className="h-8 w-8 rounded" />
      ))}
    </div>
  );
  
  // Main Skeleton for Admin Screen
  const UserSkeleton = () => (
    <div className="flex flex-col justify-between gap-4 mb-6 bg-white rounded-lg shadow p-4">
      {/* Title Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <Skeleton className="h-8 w-1/4 rounded mb-2 sm:mb-0" />
      </div>
      {/* Button Skeletons */}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
          <Skeleton className="h-10 w-20 rounded" />
          <Skeleton className="h-10 w-20 rounded" />
          <Skeleton className="h-10 w-20 rounded" />
          <Skeleton className="h-10 w-20 rounded" />
        </div>
        <Skeleton className="h-10 w-32 rounded mt-2 sm:mt-0" />
      </div>
      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white w-20">
          <thead className="bg-blue-600 text-white">
            <tr>
              {Array.from({ length: 5 }).map((_, idx) => (
                <th key={idx} className="py-2 px-4 text-center">
                  <Skeleton className="h-6 w-full rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {Array.from({ length: 3 }).map((_, idx) => (
              <TableSkeletonRow key={idx} />
            ))}
            <tr>
              <td colSpan={5} className="py-2 px-4 text-center">
                <Skeleton className="h-6 w-1/3 rounded mx-auto" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Pagination Skeleton */}
      <PaginationSkeleton />
    </div>
  );
  
  export default UserSkeleton;
  