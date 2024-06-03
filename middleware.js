import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req) {

  //run a query to see if the user is logged in and redirect to login page if not
  const cookie = req.cookies.get('nokofio_user')?.value;
  var myHeaders = new Headers();
  if(cookie){
    myHeaders.append("x-access-token", JSON.parse(cookie).accessToken);
  }
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  var isTokenAuthorized = true;

  await fetch("https://nokofi.herokuapp.com/api/v1/user/pageViewPerDate?period=all", requestOptions)
  .then(result => {

    if(result.status === 200){

      isTokenAuthorized = true;
    }
    if(result.status === 401 || result.status === 403){
      isTokenAuthorized = false;
    }
  })
  .catch(error => {

  });

  if(isTokenAuthorized  && req.nextUrl.pathname === '/login'  ){
    return NextResponse.redirect(new URL('/builder', req.url));
  }
  if(isTokenAuthorized && ( req.nextUrl.pathname === '/register' || req.nextUrl.pathname === '/login/session-expired')  ){
    return NextResponse.redirect(new URL('/builder', req.url));
  }

  const authPages = ['/login', '/register', '/login/session-expired', 'forgot-password', 'reset-password']

  if((!!cookie === false)  &&  !authPages.includes(req.nextUrl.pathname)){
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (!isTokenAuthorized && cookie &&  !authPages.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login/session-expired', req.url));
  }


  return NextResponse.next()

}

  



// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*' , '/builder/:path*', "/settings/:path*", "/login/:path*", "/register/:path*", "/login/session-expired/:path*", "/login/session-expired", "/login", "/register", "/builder", "/settings", "/dashboard", "/about", "/about-2", "/about-2/:path*"]
}
