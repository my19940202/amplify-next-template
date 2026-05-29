import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type Todo = Database['public']['Tables']['todos']['Row']

// GET /api/todos - 获取当前用户的所有 todos
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Get todos error:', error)
    return NextResponse.json({ error: '获取数据失败' }, { status: 500 })
  }

  return NextResponse.json({ todos: data as Todo[] })
}

// POST /api/todos - 创建新 todo
export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'content 不能为空' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: user.id,
        content: content.trim(),
      } as any)   // 临时绕过占位类型限制，后续生成真实类型后删除
      .select()
      .single()

    if (error) {
      console.error('Create todo error:', error)
      return NextResponse.json({ error: '创建失败' }, { status: 500 })
    }

    return NextResponse.json({ todo: data as Todo }, { status: 201 })
  } catch (err) {
    console.error('POST /api/todos error:', err)
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }
}
