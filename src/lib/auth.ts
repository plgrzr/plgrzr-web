import { createAuthClient } from 'better-auth/react';

//const token = localStorage.getItem('bearer_token');

export const auth = createAuthClient({
  baseURL: 'http://localhost:3001',
});

//   fetchOptions: {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   },
