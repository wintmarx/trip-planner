import { PageProps } from "gatsby"
import React, { useEffect } from "react"
import Layout from "../components/layout"

const Error404Page: React.FC<PageProps> = () => {
  useEffect(() => {
    document.title = "Trip Planner"
  }, [])

  return (
    <Layout
      headerCb={() => {
        window.location.href = "/"
      }}
    >
    <h1>404</h1>
    </Layout>
  )
}

export default Error404Page
