import { AppProps } from "next/dist/next-server/lib/router/router"
import React from "react"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import '../../styles/global.scss'
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <Header />
      <Component {...pageProps}/>
      <ToastContainer />
      <Footer />
    </div>
  )
}

export default MyApp
