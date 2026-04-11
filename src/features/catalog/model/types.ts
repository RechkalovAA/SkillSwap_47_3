export type CatalogItemKind = 'teach' | 'learn';

export interface CatalogItem {
  id: string;
  kind: CatalogItemKind;
  categoryId: string;
  subcategoryId: string;
  title: string;
  description: string;
  authorName: string;
  authorId: string;
  avatar: string;
  images?: string[];
}
