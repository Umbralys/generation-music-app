'use client';

import { useState } from 'react';
import { AlbumRelease } from '../data/album-releases';
import { fetchAlbumSummary, WikipediaSummary } from '../utils/wikipedia';

const eraColors: Record<string, string> = {
  '80s': 'bg-amber-500/10 text-amber-400',
  '90s': 'bg-blue-500/10 text-blue-400',
  '00s': 'bg-purple-500/10 text-purple-400',
};

const genreColors: Record<string, string> = {
  'Hip-Hop': 'bg-green-500/10 text-green-400',
  'R&B': 'bg-pink-500/10 text-pink-400',
};

interface AlbumCardProps {
  album: AlbumRelease;
  highlight?: boolean;
}

export function AlbumCard({ album, highlight = false }: AlbumCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<WikipediaSummary | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  async function handleToggle() {
    if (expanded) {
      setExpanded(false);
      return;
    }

    setExpanded(true);

    if (!fetchAttempted) {
      setLoading(true);
      setFetchAttempted(true);
      const data = await fetchAlbumSummary(album);
      setSummary(data);
      setLoading(false);
    }
  }

  return (
    <div
      className={`forum-card overflow-hidden cursor-pointer transition-all ${highlight ? 'border-amber-500/50' : ''}`}
      onClick={handleToggle}
    >
      {/* Compact view (always shown) */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h3 className={`font-semibold truncate ${highlight ? 'text-lg' : 'text-base'}`}>
            {album.title}
          </h3>
          <p className="text-gray-400 text-sm truncate">{album.artist}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-gray-500 text-sm">{album.year}</span>
          <span className={`text-gray-500 text-xs transition-transform ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${eraColors[album.era]}`}>
          {album.era}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${genreColors[album.genre]}`}>
          {album.genre}
        </span>
      </div>

      {/* Expanded metadata */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]" onClick={(e) => e.stopPropagation()}>
          {loading && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="w-4 h-4 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin" />
              Loading...
            </div>
          )}

          {!loading && !summary && fetchAttempted && (
            <p className="text-gray-500 text-sm">No additional info available.</p>
          )}

          {!loading && summary && (
            <div className="space-y-3">
              <div className="flex gap-4">
                {summary.thumbnail && (
                  <img
                    src={summary.thumbnail}
                    alt={`${album.title} cover`}
                    className="w-20 h-20 rounded object-cover shrink-0"
                  />
                )}
                <div className="min-w-0 space-y-1">
                  {summary.description && (
                    <p className="text-gray-400 text-xs italic">{summary.description}</p>
                  )}
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {summary.extract}
                  </p>
                </div>
              </div>
              {summary.pageUrl && (
                <a
                  href={summary.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-400 text-xs hover:text-blue-300 transition-colors"
                >
                  Read more on Wikipedia →
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
