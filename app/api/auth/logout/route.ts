import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      const url = new URL('/login', request.url)
      url.searchParams.set('error', error.message)
      return NextResponse.redirect(url)
    }

    return NextResponse.redirect(new URL('/login', request.url))
  } catch (error) {
    console.error('Logout error:', error)
    const url = new URL('/login', request.url)
    url.searchParams.set('error', '退出失败')
    return NextResponse.redirect(url)
  }
}
