import ScholarshipsSkeleton from './ScholarshipsSkeleton';

export default function ScholarshipsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <main className="flex-grow">
        <ScholarshipsSkeleton />
      </main>
    </div>
  );
}
