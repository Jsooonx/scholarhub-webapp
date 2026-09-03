export interface SearchItem {
  slug: string;
  name: string;
  provider: string;
  country: string;
  funding_type: string;
  degree_levels: string[];
}

export async function loadSearchItems(): Promise<SearchItem[]> {
  const mod = await import('./searchItems.json');
  return (mod.default || mod) as SearchItem[];
}
