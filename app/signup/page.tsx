'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Panel - Brand */}
      <div className="hidden w-full flex-col justify-between bg-gray-50 p-8 lg:flex lg:w-1/2 lg:p-12">
        <div>
          <Link href="/" className="inline-block text-2xl font-semibold tracking-tight text-black">
            WishNotify<span className="text-gray-400">.</span>
          </Link>
        </div>
        <div className="my-12 max-w-md">
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-black lg:text-6xl">
            Wish on time<span className="text-gray-400">.</span><br />Every time<span className="text-gray-400">.</span>
          </h1>
          <p className="mt-6 text-lg font-light text-gray-600">Never miss a birthday, anniversary, or special occasion again.</p>
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3"><span className="text-black text-lg">✓</span><span className="text-gray-700">WhatsApp & SMS reminders</span></div>
            <div className="flex items-center gap-3"><span className="text-black text-lg">✓</span><span className="text-gray-700">2‑minute setup, works forever</span></div>
            <div className="flex items-center gap-3"><span className="text-black text-lg">✓</span><span className="text-gray-700">Unlimited contacts, private & secure</span></div>
          </div>
        </div>
        <div className="text-sm text-gray-400">© WishNotify 2026</div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="text-2xl font-semibold tracking-tight text-black">WishNotify<span className="text-gray-400">.</span></Link>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-100/50">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-black">Create your account</h2>
              <p className="mt-1 text-sm text-gray-500">Join 2,500+ people who never miss a moment.</p>
            </div>

            {success ? (
              <div className="rounded-xl border border-green-100 bg-green-50/50 px-5 py-4 text-sm">
                <p className="font-medium text-green-800">✓ Account created!</p>
                <p className="mt-1 text-green-700">Redirecting you to the dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                  <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-400 shadow-sm transition-all focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-400 shadow-sm transition-all focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5" placeholder="you@email.com" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={6} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-400 shadow-sm transition-all focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5" placeholder="At least 6 characters" />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 text-sm text-red-600">{error}</div>
                )}

                <button type="submit" disabled={loading} className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-900 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating account...
                    </span>
                  ) : ('Sign up →')}
                </button>
              </form>
            )}

            {!success && (
              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-black underline-offset-4 hover:underline">Sign in</Link>
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-black">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 12L6 8l4-4" /></svg>
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}