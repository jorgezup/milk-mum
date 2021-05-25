import { useEffect } from "react"
import { api } from "../services/api"

const startBackend = () => {
  useEffect(() => {
    api.get('vacas')
  })
}

export default startBackend