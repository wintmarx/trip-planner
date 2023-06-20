import React from "react";
import "../css/header.css";

interface HeaderProps {
  siteTitle: string;
  headerCb: () => void;
}

export default function Header(props: HeaderProps) {
  return (
    <header>
      <div>
        <h1 onClick={props.headerCb}>{props.siteTitle}</h1>
      </div>
    </header>
  );
}
