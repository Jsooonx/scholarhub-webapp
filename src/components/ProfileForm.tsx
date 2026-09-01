'use client';

import { useState } from 'react';
import { Camera, Globe, MapPin, UserRound } from 'lucide-react';
import { updateProfileAction, type Profile } from '@/app/actions/profile';
import { Button } from '@/components/ui/button';

interface ProfileFormProps {
  profile: Profile | null | undefined;
  email: string | undefined;
  errorMsg: string | undefined;
  savedParam: string | undefined;
  errorParam: string | undefined;
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

export default function ProfileForm({
  profile,
  email,
  errorMsg,
  savedParam,
  errorParam,
}: ProfileFormProps) {
  // Local state for each input field to drive live preview
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [username, setUsername] = useState(profile?.username ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [location, setLocation] = useState(profile?.location ?? '');
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');

  const previewDisplayName = displayName.trim() || email || 'ScholarHub member';
  const previewUsername = username.trim() ? `@${username.trim().toLowerCase()}` : 'No username yet';
  const previewInitials = initials(displayName.trim(), email);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <section className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Basic profile</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-brand-dark">Edit your details</h2>
        </div>

        {errorMsg && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {errorMsg}
          </div>
        )}

        {errorParam && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {decodeURIComponent(errorParam)}
          </div>
        )}

        {savedParam === '1' && (
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
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
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
              value={bio}
              onChange={(e) => setBio(e.target.value)}
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Indonesia"
                className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-dark/20"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-brand-dark">Website</span>
              <input
                name="website_url"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
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
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-dark/20"
            />
            <span className="mt-1 block text-[11px] text-brand-muted">
              For v1 this uses an image URL. Upload storage can be added later when community ships.
            </span>
          </label>

          <div className="flex flex-col gap-3 border-t border-brand-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            {email && (
              <p className="text-xs text-brand-muted">
                Account email: <span className="font-semibold text-brand-dark">{email}</span>
              </p>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
            >
              Save profile
            </Button>
          </div>
        </form>
      </section>

      <aside className="space-y-5">
        <div className="rounded-3xl border border-brand-border bg-brand-cream p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Preview</p>
          <div className="mt-5 flex items-start gap-4">
            {avatarUrl.trim() ? (
              <img
                src={avatarUrl.trim()}
                alt={previewDisplayName}
                className="h-16 w-16 rounded-2xl border border-brand-border bg-white object-cover"
                onError={(e) => {
                  // Fallback to initials if the URL fails to load
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    const fallback = parent.querySelector('.avatar-fallback');
                    if (fallback) fallback.removeAttribute('style');
                  }
                }}
              />
            ) : null}
            
            {/* Fallback avatar */}
            <div
              className="avatar-fallback grid h-16 w-16 place-items-center rounded-2xl border border-brand-border bg-white font-serif text-xl font-bold text-brand-dark"
              style={avatarUrl.trim() ? { display: 'none' } : undefined}
            >
              {previewInitials}
            </div>
            
            <div className="min-w-0">
              <h2 className="font-serif text-xl font-semibold text-brand-dark">{previewDisplayName}</h2>
              <p className="text-xs font-medium text-brand-muted">{previewUsername}</p>
            </div>
          </div>

          {bio.trim() && (
            <p className="mt-5 text-sm leading-relaxed text-brand-dark">{bio}</p>
          )}

          <div className="mt-5 space-y-2 border-t border-brand-border pt-4">
            {location.trim() && (
              <p className="flex items-center gap-2 text-xs text-brand-muted">
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </p>
            )}
            {websiteUrl.trim() && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-medium text-brand-accent hover:underline"
              >
                <Globe className="h-3.5 w-3.5" />
                Website
              </a>
            )}
            {!location.trim() && !websiteUrl.trim() && (
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
  );
}
