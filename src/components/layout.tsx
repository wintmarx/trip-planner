import React from "react"
import Header from "./header"
import "../css/layout.css"

type HeaderCb = () => void

const Layout: React.FC<{ headerCb: HeaderCb }> = ({ children, headerCb }) => {
  return (
    <div className="page">
      <Header headerCb={headerCb} siteTitle={"Trip Planner"} />
      <main className="content">{children}</main>
    </div>
  )
}

export default Layout
