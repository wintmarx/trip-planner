import React from "react"
import { graphql, StaticQuery } from "gatsby"
import i18n from "../../i18n/ru.json"
import "./privacy_policy.css"

interface IProps {
  onExit?: () => void
}

const policyQuery = graphql`
  query {
    markdownRemark(fileAbsolutePath: { regex: "/ru_privacy_policy/" }) {
      html
    }
  }
`

export default class PrivacyPolicy extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  componentDidMount() {
    document?.querySelector("body")?.scrollTo(0, 0)
  }

  renderPolicy() {
    return (
      <StaticQuery
        query={policyQuery}
        render={data => (
          <div
            className="policy-content"
            dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
          />
        )}
      />
    )
  }

  render() {
    return (
      <>
        <h1 className="policy-header">{i18n["privacy_policy_header"]}</h1>
        {this.renderPolicy()}
        <button className="policy-btn" onClick={this.props.onExit}>
          <span>{i18n["ok"]}</span>
        </button>
      </>
    )
  }
}
