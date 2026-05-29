import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type Todo = Database['public']['Tables']['todos']['Row']

// GET /api/todos/[id] - 获取单个 todo
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Todo 不存在或无权限' }, { status: 404 })
  }

  return NextResponse.json({ todo: data as Todo })
}

// PATCH /api/todos/[id] - 更新 todo（目前只支持更新 content）
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

    // 先确认这条记录属于当前用户
    const { data: existing } = await supabase
      .from('todos')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Todo 不存在或无权限' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('todos')
      // @ts-ignore - 临时绕过占位类型的 Update = never 限制，后续生成真实类型后删除此行
      .update({ 
        content: content.trim(), 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Update todo error:', error)
      return NextResponse.json({ error: '更新失败' }, { status: 500 })
    }

    return NextResponse.json({ todo: data as Todo })
  } catch (err) {
    console.error('PATCH /api/todos/[id] error:', err)
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }
}

// DELETE /api/todos/[id] - 删除 todo
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  // 确认记录属于当前用户后再删除
  const { data: existing } = await supabase
    .from('todos')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Todo 不存在或无权限' }, { status: 404 })
  }

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Delete todo error:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
