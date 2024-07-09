// import { redirect, type MetaFunction } from '@remix-run/node';

import { redirect } from '@remix-run/react';

// export const meta: MetaFunction = () => {
//   return [
//     { title: 'New Remix App' },
//     { name: 'description', content: 'Welcome to Remix!' },
//   ];
// };

export const loader = () => {
  return redirect('/dashboard');
};
