export type Book = {
  id: number;
  cover: string | null;
  barcode: string;
  name: string;
  description: string;
  category: { name: string }[];
  author: string;
  translator: string;
  publish_year: number;
  cost: number;
  price: number;
  stock: number;
  quantity: number;
};

export type PaginationData = {
  data: Book[];
  per_page: number;
  total: number;
  current_page: number;
  last_page: number;
};
