import { createAuthClient } from 'better-auth/react';

//const token = localStorage.getItem('bearer_token');

export const auth = createAuthClient({
  baseURL: 'https://ls8sw8cgwwkwws04scoow8c8.13.76.121.152.sslip.io',
});

//   fetchOptions: {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   },
