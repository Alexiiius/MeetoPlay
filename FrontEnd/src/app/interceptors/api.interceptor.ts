// import { HttpInterceptorFn } from '@angular/common/http';
// import { gamesApiUrl } from '../config';

// export const apiInterceptor: HttpInterceptorFn = (req, next) => {
//   const apiToken = localStorage.getItem('api_token');

//   // Comprueba si la URL de la solicitud comienza con la URL de tu API
//   if (req.url.startsWith(gamesApiUrl)) {
//     const authReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${apiToken}`
//       }
//     });
//     return next(authReq);
//   }

//   // Si la URL de la solicitud no comienza con la URL de tu API, simplemente pasa la solicitud sin modificar
//   return next(req);
// };
