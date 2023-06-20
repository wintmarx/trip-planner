import React, { ReactNode } from "react";
import Header from "./header";
import "../css/layout.css";
import { YMInitializer } from "react-yandex-metrika";

type HeaderCb = () => void;

interface LayoutProps {
  headerCb: HeaderCb;
  children?: ReactNode | undefined;
}

export default function Layout(props: LayoutProps) {
  return (
    <div className="page">
      <YMInitializer
        accounts={process.env.GATSBY_YM_ID === undefined ? [] : [Number(process.env.GATSBY_YM_ID)]}
        options={{ webvisor: true }}
        version="2"
      />
      <Header headerCb={props.headerCb} siteTitle={"Trip Planner"} />
      <main className="content">{props.children}</main>
    </div>
  );
}
