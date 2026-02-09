import { AlbumRelease } from '../data/album-releases';

export type WikipediaSummary = {
  description: string;
  extract: string;
  thumbnail?: string;
  pageUrl: string;
};

function getWikipediaSlug(album: AlbumRelease): string {
  if (album.wikipediaSlug) return album.wikipediaSlug;
  return album.title.replace(/ /g, '_');
}

export async function fetchAlbumSummary(
  album: AlbumRelease,
): Promise<WikipediaSummary | null> {
  const slug = getWikipediaSlug(album);
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(url, {
      headers: { 'Api-User-Agent': 'Music24App/1.0' },
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (data.type === 'disambiguation') return null;

    return {
      description: data.description ?? '',
      extract: data.extract ?? '',
      thumbnail: data.thumbnail?.source,
      pageUrl: data.content_urls?.desktop?.page ?? '',
    };
  } catch {
    return null;
  }
}
