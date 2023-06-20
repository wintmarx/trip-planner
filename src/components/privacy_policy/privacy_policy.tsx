import React, { useEffect } from "react";
import { graphql, useStaticQuery } from "gatsby";
import i18n from "../../assets/i18n/locale/ru.json";
import "./privacy_policy.css";

interface PrivacyPolicyProps {
  onExit?: () => void;
}

const POLICY_QUERY = graphql`
  query {
    markdownRemark(fileAbsolutePath: { regex: "/ru_privacy_policy/" }) {
      html
    }
  }
`;

export default function PrivacyPolicy(props: PrivacyPolicyProps) {
  const loadedPolicy = useStaticQuery(POLICY_QUERY);

  useEffect(() => {
    document?.querySelector("body")?.scrollTo(0, 0);
  }, []);

  return (
    <>
      <h1 className="policy-header">{i18n["privacy_policy_header"]}</h1>
      <div className="policy-content" dangerouslySetInnerHTML={{ __html: loadedPolicy.markdownRemark.html }} />
      <button className="policy-btn" onClick={props.onExit}>
        <span>{i18n["ok"]}</span>
      </button>
    </>
  );
}
