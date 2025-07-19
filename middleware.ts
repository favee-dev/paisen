import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');
    const isProtectedPage = req.nextUrl.pathname.startsWith('/chat') || req.nextUrl.pathname.startsWith('/dashboard');

    // 認証ページ（ログイン・登録）にアクセスした場合
    if (isAuthPage) {
      if (isAuth) {
        // 既にログイン済みの場合はチャットページにリダイレクト
        return NextResponse.redirect(new URL('/chat', req.url));
      }
      // 未ログインの場合はそのまま表示
      return null;
    }

    // 保護されたページにアクセスした場合
    if (isProtectedPage && !isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      // 未ログインの場合はログインページにリダイレクト
      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url));
    }

    // その他のページはそのまま通す
    return null;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // ルートページや静的ファイルは常に許可
        if (
          req.nextUrl.pathname === '/' ||
          req.nextUrl.pathname.startsWith('/_next') ||
          req.nextUrl.pathname.startsWith('/api/auth')
        ) {
          return true;
        }

        // 認証ページは常に許可
        if (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')) {
          return true;
        }

        // 保護されたページはトークンが必要
        if (req.nextUrl.pathname.startsWith('/chat') || req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
