import { useEffect } from 'react'
import { useRouter } from 'next/router'
import MeteorFetch from '@/util/web/MeteorFetch'

export default function RedirectToDashboard() {
  const router = useRouter()

  useEffect(() => {
    MeteorFetch("/api/config/status").then((body) => {
      console.log(body)
      router.push(body.goTo)
    })
  }, [])

  return null
}

