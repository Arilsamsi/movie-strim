export default function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]">
      <div className="aspect-[2/3] rounded-xl bg-gray-800/50 animate-pulse mb-3" />
      <div className="h-4 bg-gray-800/50 rounded animate-pulse w-3/4 mb-2" />
      <div className="h-3 bg-gray-800/50 rounded animate-pulse w-1/2" />
    </div>
  );
}
