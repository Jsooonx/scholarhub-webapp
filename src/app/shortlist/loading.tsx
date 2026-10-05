import ShortlistSkeleton from './ShortlistSkeleton';

export default function ShortlistLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <main className="flex-grow">
        <ShortlistSkeleton />
      </main>
    </div>
  );
}
