import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const ProductSkeleton = () => (
  <div className="flex justify-between items-center px-6 py-4">
    <div className="flex items-center gap-4">
      <Skeleton circle width={40} height={40} />
      <div>
        <Skeleton width={120} height={16} />
        <Skeleton width={180} height={14} className="mt-2" />
      </div>
    </div>
    <Skeleton width={60} height={16} />
  </div>
);
