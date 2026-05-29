'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Todo {
  id: string
  content: string | null
  created_at: string
}

interface TodosClientProps {
  initialTodos: Todo[]
}

export default function TodosClient({ initialTodos }: TodosClientProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [newContent, setNewContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 刷新数据（调用服务端重新获取）
  const refresh = () => {
    router.refresh()
  }

  // 创建 Todo
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContent.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent.trim() }),
      })

      if (res.ok) {
        const { todo } = await res.json()
        setTodos([todo, ...todos])
        setNewContent('')
      } else {
        alert('创建失败')
      }
    } catch (err) {
      alert('网络错误')
    } finally {
      setLoading(false)
    }
  }

  // 删除 Todo
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个 Todo 吗？')) return

    const res = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setTodos(todos.filter(t => t.id !== id))
    } else {
      alert('删除失败')
    }
  }

  // 编辑 Todo（简单 prompt 方式，保持原项目简洁风格）
  const handleEdit = async (todo: Todo) => {
    const newContent = prompt('编辑内容', todo.content || '')
    if (newContent === null || newContent.trim() === '') return

    const res = await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newContent.trim() }),
    })

    if (res.ok) {
      const { todo: updated } = await res.json()
      setTodos(todos.map(t => t.id === todo.id ? updated : t))
    } else {
      alert('更新失败')
    }
  }

  return (
    <>
      {/* 新建表单 */}
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="What needs to be done?"
          style={{
            flex: 1,
            padding: '0.65rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
        <button type="submit" disabled={loading || !newContent.trim()}>
          {loading ? '添加中...' : '+ new'}
        </button>
      </form>

      {/* Todo 列表 */}
      <ul>
        {todos.length === 0 && (
          <li style={{ color: '#888', textAlign: 'center' }}>
            还没有任务，创建一个吧！
          </li>
        )}
        {todos.map((todo) => (
          <li 
            key={todo.id} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '10px 12px',
              cursor: 'pointer'
            }}
            onClick={() => handleEdit(todo)}
          >
            <span>{todo.content}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(todo.id)
              }}
              style={{ 
                background: '#c0392b', 
                padding: '0.3rem 0.7rem', 
                fontSize: '0.8rem' 
              }}
            >
              删除
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
        点击列表项可编辑 • 共 {todos.length} 条
      </div>
    </>
  )
}
