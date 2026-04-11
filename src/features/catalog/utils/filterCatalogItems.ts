import type { CatalogItem, CatalogItemKind } from '../model/types';

export type CatalogFilterMode = 'all' | CatalogItemKind;
export type CatalogFilterCategory = 'all' | string;

export interface CatalogFilters {
  search: string;
  categoryId: CatalogFilterCategory;
  mode: CatalogFilterMode;
}

export const filterCatalogItems = (
  items: CatalogItem[],
  { search, categoryId, mode }: CatalogFilters,
): CatalogItem[] => {
  const searchTerm = search.trim().toLowerCase();

  return items.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm) ||
      item.authorName.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm);

    const matchesCategory =
      categoryId === 'all' || item.categoryId === categoryId;

    const matchesMode = mode === 'all' || item.kind === mode;

    return matchesSearch && matchesCategory && matchesMode;
  });
};
