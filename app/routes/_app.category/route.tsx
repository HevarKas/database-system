import { Card, CardHeader, CardTitle, CardFooter } from '~/components/ui/card';
import { createCategory, getCategory } from '~/api/endpoints/category';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/ui/button';

type DataType = {
  id: number;
  name: string;
}[];

export const loader = async ({ request }: { request: Request }) => {
  const data = await getCategory(request);

  return { data };
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();

  const name = formData.get('name') as string;

  await createCategory({ request, name });

  return null;
};

function Category() {
  const { data }: { data?: DataType } = useLoaderData();

  return (
    <section className="flex flex-col gap-8">
      <Outlet />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Categories</h1>

        <Link to="create-category">
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
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardFooter>
                <Link
                  to={`/${category.id}/books`}
                  className="text-primary underline"
                >
                  View
                </Link>
              </CardFooter>
            </Card>
          ))}

        {!data && <div>No categories found</div>}
      </div>
    </section>
  );
}

export default Category;
