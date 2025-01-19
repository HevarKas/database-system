import { redirect } from '@remix-run/node';

export const loader = () => {
  try {
    return redirect('/dashboard');
  } catch (error) {
    console.error('Error during redirection:', error);
    
    throw new Response('Unable to redirect. Please try again later.', { status: 500 });
  }
};
