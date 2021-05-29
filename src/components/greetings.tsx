import React from "react"
import { ThemeButton } from "./theme-button"
import { StaticImage } from "gatsby-plugin-image"
import i18n from "../i18n/ru.json"
import "../css/greetings.css"

interface IProps {
  onExit: () => void
}

export default class Greetings extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  render() {
    return (
      <div className="greet-container">
        <div className="greet-left-side">
          <h1 className="greet-header">
            {i18n["greeting_header_1st"]}
            <img className="waving-icon" src="waving.png" />
            <br />
            {i18n["greeting_header_2nd"]}
          </h1>
          <p className="greet-desc">{i18n["greeting_desc"]}</p>

          <ThemeButton className="greet-btn" onClick={this.props.onExit}>
            {i18n["create_trip_btn"]}
            <img className="sparkles-icon" src="sparkles.png" />
          </ThemeButton>
        </div>
        <StaticImage
          className="greet-img"
          src="../images/illustration.svg"
          alt=""
          loading="eager"
        />
      </div>
    )
  }
}
