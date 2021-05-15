import React from "react"
import "../css/header.css"

interface IProps {
  siteTitle: string
  headerCb: () => void
}

export default class Header extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  render() {
    return (
      <header>
        <div>
          <h1 onClick={this.props.headerCb}>{this.props.siteTitle}</h1>
        </div>
      </header>
    )
  }
}
