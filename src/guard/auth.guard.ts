import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  if(state.url=="/login"){
    return true;
  }
  let token = sessionStorage.getItem("sessionToken");
  if(!token){
    return true;
  }
  return true;
};
