
// Skeleton component for different sections
const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-gray-300 animate-pulse ${className}`}></div>
);

// Skeleton for Table Row
const TableApproSkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="py-2 px-4 text-center">
      <Skeleton className="h-4 rounded-full" />
    </td>
    <td className="py-2 px-4 text-center">
      <Skeleton className="h-4 rounded-full" />
    </td>
    <td className="py-2 px-4 text-center">
      <div className="flex items-center justify-center space-x-2">
        <Skeleton className="h-4 w-8 rounded" />
        <Skeleton className="h-4 w-8 rounded" />
      </div>
    </td>
    <td className="py-2 px-4 text-center">
      <Skeleton className="h-4 rounded-full w-6" />
    </td>
  </tr>
);

const ArticleApproSkeleton = () => {
  return (
    <div className="product-list bg-white rounded-lg shadow p-4">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-4 flex-wrap">
        <Skeleton className="h-6 rounded-full w-48" />
      </div>

      {/* Filters and Search Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-4 rounded-full w-24 mb-2" />
        <Skeleton className="h-10 rounded w-full" />
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-300 animate-pulse">
              <th className="py-2 px-4"></th>
              <th className="py-2 px-4"></th>
              <th className="py-2 px-4"></th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, idx) => (
              <TableApproSkeletonRow key={idx} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Skeleton */}
      <div className="w-full h-12 flex justify-between mt-4">
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>

      {/* Additional Loading Indicator */}
      <br />
      <Skeleton className="h-8 w-16 rounded mt-2" />
    </div>
  );
};

export default ArticleApproSkeleton;