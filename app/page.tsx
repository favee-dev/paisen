'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return; // セッション読み込み中

    if (session) {
      // ログイン済みの場合はチャットページにリダイレクト
      router.push('/chat');
    } else {
      // 未ログインの場合はローディングを終了してウェルカム画面を表示
      setIsLoading(false);
    }
  }, [session, status, router]);

  if (isLoading || status === 'loading') {
    return (
      <main className='flex min-h-screen flex-col items-center justify-center p-24'>
        <h1 className='text-4xl font-bold mb-4'>AI先輩</h1>
        <p className='text-xl text-gray-600'>読み込み中...</p>
      </main>
    );
  }

  // 未ログイン時のウェルカム画面
  return (
    <main className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50'>
      <div className='flex min-h-screen flex-col items-center justify-center p-4 sm:p-24'>
        <div className='max-w-md w-full space-y-8 text-center'>
          <div>
            <h1 className='text-5xl sm:text-6xl font-bold text-gray-900 mb-4'>🤖</h1>
            <h2 className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2'>AI先輩</h2>
            <p className='text-lg sm:text-xl text-gray-600 mb-4 sm:mb-8'>率直なコミュニケーションをサポートします</p>
            <p className='text-sm sm:text-base text-gray-500 mb-8 sm:mb-12'>
              リモートワークでも本音を伝えられる、AI先輩サービス
            </p>
          </div>

          <div className='space-y-4'>
            <Link
              href='/login'
              className='btn-gradient w-full text-center'
            >
              ログイン
            </Link>

            <Link
              href='/register'
              className='w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-purple-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200'
            >
              新規アカウント作成
            </Link>
          </div>

          <div className='mt-8 text-sm text-gray-500'>
            <p>✨ 愚痴や不満をAI先輩が建設的に変換</p>
            <p>🎭 4つのアバターから選択可能</p>
            <p>🔒 安全でプライベートなチャット環境</p>
          </div>
        </div>
      </div>
    </main>
  );
}
