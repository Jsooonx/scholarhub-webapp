import ProfileSkeleton from './ProfileSkeleton';

export default function ProfileLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <main className="flex-grow">
        <ProfileSkeleton />
      </main>
    </div>
  );
}
