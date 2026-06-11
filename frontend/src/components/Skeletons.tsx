interface SkeletonProps {
  children: React.ReactNode
}

export const TrSkeleton = ({ children }: SkeletonProps) => {
  return (
    <tr className="animate-pulse border-b border-gray-200 dark:border-gray-700">
      {children}
    </tr>
  );
};

export const TdNoSkeleton = () => (
  <td className="px-6 py-4">
    <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
  </td>
)

export const TdNameSkeleton = () => (
  <td className="px-6 py-4">
    <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
  </td>
)

export const TdTypeSkeleton = () => (
  <td className="px-6 py-4">
    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
  </td>
)

export const TdContentSkeleton = () => (
  <td className="px-6 py-4">
    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
  </td>
)

export const TdStatusSkeleton = () => (
  <td className="px-6 py-4">
    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
  </td>
)

export const TdActionSkeleton = () => (
  <td className="px-6 py-4">
    <div className="flex justify-center gap-3">
      {/* <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-md"></div> */}
      <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
      <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
    </div>
  </td>
)

// Skeleton untuk Kolom Order ID
export const TdIdSkeleton = () => (
  <td className="px-6 py-4">
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-28"></div>
  </td>
);

// Skeleton untuk Kolom Tanggal (Date)
export const TdDateSkeleton = () => (
  <td className="px-6 py-4">
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-36"></div>
  </td>
);

// Skeleton untuk Kolom Total Harga (Price)
export const TdPriceSkeleton = () => (
  <td className="px-6 py-4">
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
  </td>
);
