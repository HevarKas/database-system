import {
  isRouteErrorResponse,
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import ErrorIcon from '~/assets/ErrorIcon';

import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from '~/components/ui/card';

import { CategoryGetDataType } from '~/shared/types/pages/category';

import { getCategory } from '~/api/endpoints/category';

export const loader = async ({ request }: { request: Request }) => {
  try {
    const data = await getCategory(request);
    return { data };
  } catch (error) {
    console.error("Error fetching category:", error);
    return redirect('/');
  }
};

function Category() {
  const { data }: { data?: CategoryGetDataType } = useLoaderData();
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-8">
      <Outlet />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t('category.categories')}</h1>
        <Link to="create-category">
          <Button>{t('category.createCategory')}</Button>
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
        <div className="text-center text-lg">
          {t('Category.noCategoriesFound')}
        </div>
      )}
    </section>
  );
}

export default Category;

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-180px)] dark:bg-gray-900 p-6">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 flex-shrink-0 mr-4">
            <ErrorIcon />
          </div>
          <div>
            {isRouteErrorResponse(error) ? (
              <>
                <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {error.status} {error.statusText}
                </h1>
                <p className="text-gray-800 dark:text-gray-300">{error.data}</p>
              </>
            ) : error instanceof Error ? (
              <>
                <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  Error
                </h1>
                <p className="text-gray-800 dark:text-gray-300">
                  {error.message}
                </p>
              </>
            ) : (
              <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
                Unknown Error
              </h1>
            )}
          </div>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Please try again later or contact support if the issue persists.
        </p>
      </div>
    </div>
  );
}
