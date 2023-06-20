import React, { useEffect } from "react";
import Layout from "../components/layout";

export default function Error404Page() {
  useEffect(() => {
    document.title = "Trip Planner";
  });

  return (
    <Layout
      headerCb={() => {
        window.location.href = "/";
      }}
    >
      <h1>404</h1>
    </Layout>
  );
}
