'use client';

import { useState, useEffect } from 'react';
import { Camera, Globe, MapPin, UserRound, Loader2 } from 'lucide-react';
import { updateProfileAction, type Profile } from '@/app/actions/profile';
import { Button } from '@/components/ui/button';

interface ProfileFormProps {
  profile: Profile | null | undefined;
  email: string | undefined;
  errorMsg: string | undefined;
  savedParam: string | undefined;
  errorParam: string | undefined;
}

function initials(name?: string | null, email?: string): string {
  const source = String(name || email || 'ScholarHub').trim();
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return ((parts[0][0] || '') + (parts[1][0] || '')).toUpperCase();
  }
  return (source.slice(0, 2) || 'SH').toUpperCase();
}

export default function ProfileForm({
  profile,
  email,
  errorMsg,
  savedParam,
  errorParam,
}: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setWebsiteUrl(profile.website_url || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const safeDisplayName = String(displayName || '').trim();
  const safeUsername = String(username || '').trim();
  const safeBio = String(bio || '').trim();
  const safeLocation = String(location || '').trim();
  const safeWebsiteUrl = String(websiteUrl || '').trim();
  const safeAvatarUrl = String(avatarUrl || '').trim();

  const previewDisplayName = safeDisplayName || email || 'ScholarHub member';
  const previewUsername = safeUsername ? `@${safeUsername.toLowerCase()}` : 'No username yet';
  const previewInitials = initials(safeDisplayName, email);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(savedParam === '1');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: safeDisplayName || null,
          username: safeUsername || null,
          bio: safeBio || null,
          location: safeLocation || null,
          website_url: safeWebsiteUrl || null,
          avatar_url: safeAvatarUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setFormError(data.error || 'Failed to save profile.');
      } else {
        setSaveSuccess(true);
      }
    } catch (err) {
      setFormError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const displayError = formError || (errorParam ? decodeURIComponent(errorParam) : null);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <section className="rounded-3xl border border-brand-border bg-white p-6 shadow-xs">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Basic profile</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-brand-dark">Edit your details</h2>
        </div>

        {errorMsg && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {errorMsg}
          </div>
        )}

        {displayError && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {displayError}
          </div>
        )}

        {saveSuccess && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Profile saved successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} action={updateProfileAction} className="space-y-5">
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
                className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
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
                className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm lowercase text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
              />
              <span className="mt-1 block text-[11px] text-brand-muted">3-30 chars: lowercase letters, numbers, underscore.</span>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-brand-dark">Bio</span>
            <textarea
              name="bio"
              maxLength={280}
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others what you study, where you want to go, or what scholarships you are targeting."
              className="w-full resize-none rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
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
                className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
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
                className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
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
              className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
            />
            <span className="mt-1 block text-[11px] text-brand-muted">
              Optional image link for your avatar.
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
              disabled={saving}
              icon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            >
              {saving ? 'Saving profile...' : 'Save profile'}
            </Button>
          </div>
        </form>
      </section>

      <aside className="space-y-5">
        <div className="rounded-3xl border border-brand-border bg-brand-cream p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Preview</p>
          <div className="mt-5 flex items-start gap-4">
            {safeAvatarUrl ? (
              <img
                src={safeAvatarUrl}
                alt={previewDisplayName}
                className="h-16 w-16 rounded-2xl border border-brand-border bg-white object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    const fallback = parent.querySelector('.avatar-fallback');
                    if (fallback) fallback.removeAttribute('style');
                  }
                }}
              />
            ) : null}
            
            <div
              className="avatar-fallback grid h-16 w-16 place-items-center rounded-2xl border border-brand-border bg-white font-serif text-xl font-bold text-brand-dark"
              style={safeAvatarUrl ? { display: 'none' } : undefined}
            >
              {previewInitials}
            </div>
            
            <div className="min-w-0">
              <h2 className="font-serif text-xl font-semibold text-brand-dark">{previewDisplayName}</h2>
              <p className="text-xs font-medium text-brand-muted">{previewUsername}</p>
            </div>
          </div>

          {safeBio && (
            <p className="mt-5 text-sm leading-relaxed text-brand-dark">{safeBio}</p>
          )}

          <div className="mt-5 space-y-2 border-t border-brand-border pt-4">
            {safeLocation && (
              <p className="flex items-center gap-2 text-xs text-brand-muted">
                <MapPin className="h-3.5 w-3.5" />
                {safeLocation}
              </p>
            )}
            {safeWebsiteUrl && (
              <a
                href={safeWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-medium text-brand-accent hover:underline"
              >
                <Globe className="h-3.5 w-3.5" />
                Website
              </a>
            )}
            {!safeLocation && !safeWebsiteUrl && (
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
            This profile is associated with your account and will be used across your shortlists, saved searches, and future community features.
          </p>
        </div>
      </aside>
    </div>
  );
}
