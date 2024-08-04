import { Card, CardHeader, CardTitle, CardFooter } from '~/components/ui/card';
import { getCategory } from '~/api/endpoints/category';
import { Link, Outlet, useLoaderData, useSearchParams } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination';
import { useCallback, useEffect } from 'react';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';

type DataType = {
  id: number;
  name: string;
}[];

export const loader = async ({ request }: { request: Request }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get('page') || '1';

  const data = await getCategory(page, request);

  return { data };
};

function Category() {
  const { data }: { data?: DataType } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleDecreasePage = useCallback(() => {
    if (searchParams.get('page') === '1') return;
    const currentPage = Number(searchParams.get('page')) || 1;
    const newPage = Math.max(currentPage - 1, 1);
    setSearchParams({ page: String(newPage) });
  }, [searchParams, setSearchParams]);

  const handleIncreasePage = () => {
    if (data && data.length < 20) return;
    const currentPage = Number(searchParams.get('page')) || 1;
    const newPage = currentPage + 1;
    setSearchParams({ page: String(newPage) });
  };

  useEffect(() => {
    if (data && data.length === 0 && Number(searchParams.get('page')) > 1) {
      handleDecreasePage();
    }
  }, [data, handleDecreasePage, searchParams]);

  return (
    <section className="flex flex-col gap-8">
      <Outlet />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Categories</h1>

        <Link
          to={`create-category?${searchParams}`}
          className="flex items-center"
        >
          <Button>Create Category</Button>
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {data &&
          data.map((category) => (
            <Card
              key={category.id}
              className="flex flex-col items-center justify-center dark:bg-gray-800"
            >
              <CardHeader>
                <CardTitle className="break-all">{category.name}</CardTitle>
              </CardHeader>
              <CardFooter>
                <Link
                  to={`/${category.id}/books`}
                  className="text-primary underline"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    className="hover:bg-blue-300"
                  >
                    <FaEye />
                  </Button>
                </Link>
                <Link to={`/${category.id}/delete`}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="hover:bg-red-300"
                  >
                    <FaTrash />
                  </Button>
                </Link>

                <Button
                  type="button"
                  variant="ghost"
                  className="hover:bg-yellow-300"
                >
                  <FaPencilAlt />
                </Button>
              </CardFooter>
            </Card>
          ))}

        {!data && <div>No categories found</div>}
      </div>

      <div className="flex flex-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handleDecreasePage} />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={handleIncreasePage} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}

export default Category;
