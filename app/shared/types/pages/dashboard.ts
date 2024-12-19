type categoriesWithMostBooksInStock = {
    id: number;
    name: string;
    books_count: number;
};
    
export type reportDataType = {
    books_added_in_last_2_weeks: number;
    categories_with_most_books_in_stock: categoriesWithMostBooksInStock[];
    orders_completed_today: number;
    orders_today: number;
    total_books: number;
    total_categories: number;
};

export type incomeDataType = {
    total: number;
    paid: number;
    amount_due: number;
};

export type timeRangeType = 'day' | 'week' | 'month' | 'year';
