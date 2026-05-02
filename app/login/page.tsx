'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_30%,rgba(0,0,0,0.02)_0%,transparent_50%)]" />

      <div className="mb-8 text-center">
        <Link href="/" className="inline-block text-2xl font-semibold tracking-tight text-black">
          WishNotify<span className="text-gray-400">.</span>
        </Link>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-xl shadow-gray-100 backdrop-blur-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to continue to your dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-400 shadow-sm transition-all focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-400 shadow-sm transition-all focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-900 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-black underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-gray-400">
        <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-black">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Back to home
        </Link>
      </p>
    </div>
  )
}