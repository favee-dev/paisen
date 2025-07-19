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
    <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='flex min-h-screen flex-col items-center justify-center p-24'>
        <div className='max-w-md w-full space-y-8 text-center'>
          <div>
            <h1 className='text-6xl font-bold text-gray-900 mb-4'>🤖</h1>
            <h2 className='text-4xl font-bold text-gray-900 mb-2'>AI先輩</h2>
            <p className='text-xl text-gray-600 mb-8'>率直なコミュニケーションをサポートします</p>
            <p className='text-gray-500 mb-12'>
              リモートワークでも本音を伝えられる、AI先輩サービス
            </p>
          </div>

          <div className='space-y-4'>
            <Link
              href='/login'
              className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
            >
              ログイン
            </Link>

            <Link
              href='/register'
              className='w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
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
