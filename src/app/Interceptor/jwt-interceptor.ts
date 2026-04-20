import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem('ShopToken');
  if(token){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${JSON.parse(token).token}`
      }
    });
  }
  
  return next(req);
};
