import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto p-8 pt-24">
      <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
      <p className="text-gray-600">Welcome, {user.email}</p>
      <p className="text-sm text-gray-400 mt-4">Your contacts and reminders will appear here (Phase 3).</p>
    </div>
  )
}