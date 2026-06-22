import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCurrentProfile, updateProfileAction } from '@/app/actions/profile';
import { BASE_URL } from '@/lib/scholarships';
import { Camera, Globe, MapPin, UserRound } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your ScholarHub profile.',
  alternates: {
    canonical: `${BASE_URL}/profile`,
  },
};

export const dynamic = 'force-dynamic';

function fieldValue(value: string | null | undefined) {
  return value ?? '';
}

function initials(name?: string | null, email?: string) {
  const source = name || email || 'ScholarHub';
  return source
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SH';
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const result = await getCurrentProfile();

  if (!result.authenticated && !result.error) {
    redirect('/login?next=/profile');
  }

  const profile = result.profile;
  const displayName = profile?.display_name || result.email || 'ScholarHub member';
  const username = profile?.username ? `@${profile.username}` : 'No username yet';

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Navbar />

      <main className="flex-grow">
        <div className="border-b border-brand-border bg-brand-bg">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <nav className="mb-2 text-xs text-brand-muted">
              <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
              <span className="mx-2">·</span>
              <span className="font-medium text-brand-dark">Profile</span>
            </nav>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-brand-dark sm:text-5xl">
              Profile
            </h1>
            <p className="mt-2 max-w-xl text-sm text-brand-muted">
              Set up your public ScholarHub identity before community features arrive.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <section className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Basic profile</p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-brand-dark">Edit your details</h2>
            </div>

            {result.error && (
              <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {result.error}
              </div>
            )}

            {params.error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {decodeURIComponent(params.error)}
              </div>
            )}

            {params.saved === '1' && (
              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Profile saved.
              </div>
            )}

            <form action={updateProfileAction} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-brand-dark">Display name</span>
                  <input
                    name="display_name"
                    type="text"
                    maxLength={80}
                    defaultValue={fieldValue(profile?.display_name)}
                    placeholder="Your full name"
                    className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-dark/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-brand-dark">Username</span>
                  <input
                    name="username"
                    type="text"
                    maxLength={30}
                    defaultValue={fieldValue(profile?.username)}
                    placeholder="gielang"
                    className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm lowercase text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-dark/20"
                  />
                  <span className="mt-1 block text-[11px] text-brand-muted">3-30 chars: lowercase letters, numbers, underscore.</span>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-brand-dark">Bio</span>
                <textarea
                  name="bio"
                  maxLength={280}
                  rows={5}
                  defaultValue={fieldValue(profile?.bio)}
                  placeholder="Tell others what you study, where you want to go, or what scholarships you are targeting."
                  className="w-full resize-none rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-dark/20"
                />
              </label>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-brand-dark">Location</span>
                  <input
                    name="location"
                    type="text"
                    maxLength={80}
                    defaultValue={fieldValue(profile?.location)}
                    placeholder="Indonesia"
                    className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-dark/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-brand-dark">Website</span>
                  <input
                    name="website_url"
                    type="url"
                    defaultValue={fieldValue(profile?.website_url)}
                    placeholder="https://example.com"
                    className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-dark/20"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-brand-dark">Avatar image URL</span>
                <input
                  name="avatar_url"
                  type="url"
                  defaultValue={fieldValue(profile?.avatar_url)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-dark/20"
                />
                <span className="mt-1 block text-[11px] text-brand-muted">
                  For v1 this uses an image URL. Upload storage can be added later when community ships.
                </span>
              </label>

              <div className="flex flex-col gap-3 border-t border-brand-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                {result.email && (
                  <p className="text-xs text-brand-muted">
                    Account email: <span className="font-semibold text-brand-dark">{result.email}</span>
                  </p>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-brand-dark px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Save profile
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-brand-border bg-brand-cream p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Preview</p>
              <div className="mt-5 flex items-start gap-4">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-16 w-16 rounded-2xl border border-brand-border bg-white object-cover"
                  />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-2xl border border-brand-border bg-white font-serif text-xl font-bold text-brand-dark">
                    {initials(profile?.display_name, result.email)}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="font-serif text-xl font-semibold text-brand-dark">{displayName}</h2>
                  <p className="text-xs font-medium text-brand-muted">{username}</p>
                </div>
              </div>

              {profile?.bio && (
                <p className="mt-5 text-sm leading-relaxed text-brand-dark">{profile.bio}</p>
              )}

              <div className="mt-5 space-y-2 border-t border-brand-border pt-4">
                {profile?.location && (
                  <p className="flex items-center gap-2 text-xs text-brand-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </p>
                )}
                {profile?.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-brand-accent hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Website
                  </a>
                )}
                {!profile?.location && !profile?.website_url && (
                  <p className="flex items-center gap-2 text-xs text-brand-muted">
                    <UserRound className="h-3.5 w-3.5" />
                    Add details to complete your profile.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-brand-border bg-white p-6">
              <div className="mb-3 flex items-center gap-2">
                <Camera className="h-4 w-4 text-brand-muted" />
                <p className="text-sm font-semibold text-brand-dark">Community-ready base</p>
              </div>
              <p className="text-xs leading-relaxed text-brand-muted">
                This profile table is public-readable and owner-editable, so later community features can reuse the same identity layer for posts, comments, and member cards.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
