import { useEffect } from "react"

const startBackend = () => {
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL)
  }, [])
}

export default startBackend