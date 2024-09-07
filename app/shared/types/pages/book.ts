export type BookActionDataType = {
  name: string;
  description: string;
  author: string;
  translator: string;
  publish_year: number;
  cost: number;
  price: number;
  stock: number;
  category_id: number;
  barcode: string;
};

export type BookGetDataType = {
  id: number;
  name: string;
  description: string;
  author: string;
  translator: string;
  publish_year: number;
  cost: number;
  price: number;
  stock: number;
  category: string;
  barcode: string;
};

export type BooksDataType = {
  current_page: number;
  data: BookGetDataType[];
  last_page: number;
  per_page: number;
  total: number;
};
