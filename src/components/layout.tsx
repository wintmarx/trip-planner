import React from "react"
import Header from "./header"
import "../css/layout.css"
import { YMInitializer } from "react-yandex-metrika"

type HeaderCb = () => void

const Layout: React.FC<{ headerCb: HeaderCb }> = ({ children, headerCb }) => {
  return (
    <div className="page">
      <YMInitializer
        accounts={
          process.env.GATSBY_YM_ID === undefined
            ? []
            : [Number(process.env.GATSBY_YM_ID)]
        }
        options={{ webvisor: true }}
        version="2"
      />
      <Header headerCb={headerCb} siteTitle={"Trip Planner"} />
      <main className="content">{children}</main>
    </div>
  )
}

export default Layout
