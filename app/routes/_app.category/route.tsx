import { Card, CardHeader, CardTitle, CardFooter } from '~/components/ui/card';
import { getCategory } from '~/api/endpoints/category';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

type DataType = {
  id: number;
  name: string;
}[];

export const loader = async ({ request }: { request: Request }) => {
  const data = await getCategory(request);

  return { data };
};

function Category() {
  const { data }: { data?: DataType } = useLoaderData();

  return (
    <section className="flex flex-col gap-8">
      <Outlet />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Categories</h1>

        <Link to="create-category" className="flex items-center">
          <Button>Create Category</Button>
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {data &&
          data.length !== 0 &&
          data.map((category) => (
            <Card
              key={category.id}
              className="flex flex-col items-center justify-center dark:bg-gray-800"
            >
              <CardHeader>
                <CardTitle className="break-all">{category.name}</CardTitle>
              </CardHeader>
              <CardFooter>
                <Link to={`${category.id}/delete-category`}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="hover:bg-red-300"
                  >
                    <FaTrash />
                  </Button>
                </Link>

                <Link to={`${category.id}/update-category`}>
                  <Button
                    type="button"
                    variant="ghost"
                    className="hover:bg-yellow-300"
                  >
                    <FaPencilAlt />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
      </div>

      {data && data.length === 0 && (
        <div className="text-center text-lg">No categories found</div>
      )}
    </section>
  );
}

export default Category;
