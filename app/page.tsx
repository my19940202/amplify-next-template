import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TodosClient from './todos-client'

export default async function TodosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 服务端直接查询（推荐做法，比调用自己 API 更快）
  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main style={{ padding: '2rem', maxWidth: '520px', margin: '0 auto', width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem' 
      }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>My todos</h1>
        
        <form action="/api/auth/logout" method="POST">
          <button 
            type="submit"
            style={{ 
              padding: '0.4rem 0.9rem', 
              fontSize: '0.85rem',
              background: '#333'
            }}
          >
            退出登录
          </button>
        </form>
      </div>

      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        已登录：{user.email}
      </p>

      {/* 客户端交互组件 */}
      <TodosClient initialTodos={todos || []} />

      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
        Powered by Supabase + Next.js REST API
      </div>
    </main>
  )
}
