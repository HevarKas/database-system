import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from '~/components/ui/card';

import { getCategoryType } from '~/shared/types/pages/category';

import { getCategory } from '~/api/endpoints/category';

export const loader = async ({ request }: { request: Request }) => {
  const data = await getCategory(request);

  return { data };
};

function Category() {
  const { data }: { data?: getCategoryType } = useLoaderData();

  return (
    <section className="flex flex-col gap-8">
      <Outlet />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link to="create-category">
          <Button>Create Category</Button>
        </Link>
      </div>

      {data && data.length > 0 && (
        <div className="grid grid-cols-5 gap-4">
          {data.map((category) => (
            <Card
              key={category.id}
              className="flex flex-col items-center justify-center dark:bg-gray-800"
            >
              <CardHeader>
                <CardTitle className="break-all">{category.name}</CardTitle>
              </CardHeader>
              <CardFooter className="flex gap-2">
                <Link to={`${category.id}/delete-category`}>
                  <Button variant="link" className="hover:text-red-500">
                    <FaTrash />
                  </Button>
                </Link>
                <Link to={`${category.id}/update-category`}>
                  <Button variant="link" className="hover:text-yellow-500">
                    <FaPencilAlt />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {data && data.length === 0 && (
        <div className="text-center text-lg">No categories found</div>
      )}
    </section>
  );
}

export default Category;
