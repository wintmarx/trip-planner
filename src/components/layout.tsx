import React from "react"
import Header from "./header"
import "../css/layout.css"
import { YMInitializer } from "react-yandex-metrika"

type HeaderCb = () => void

const Layout: React.FC<{ headerCb: HeaderCb }> = ({ children, headerCb }) => {
  return (
    <div className="page">
      <YMInitializer
        accounts={[79333369]}
        options={{ webvisor: true }}
        version="2"
      />
      <Header headerCb={headerCb} siteTitle={"Trip Planner"} />
      <main className="content">{children}</main>
    </div>
  )
}

export default Layout
