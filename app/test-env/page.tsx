export default function TestEnv() {
  return (
    <div>
      <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING'}</p>
      <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'MISSING'}</p>
    </div>
  )
}