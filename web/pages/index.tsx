import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function RedirectToDashboard() {
  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [])

  return null
}

