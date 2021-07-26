import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import i18n from "../i18n/ru.json"
import "../css/final.css"
import MediaQuery from "react-responsive"

interface IProps {
  onEnterValidEmail?: (email: string) => void
  onExit?: (email: string) => void
  error?: boolean
}

interface IState {
  email: string
  emailValid: boolean
}

export default class Final extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { email: "", emailValid: true }

    this.onInput = this.onInput.bind(this)
    this.isInputError = this.isInputError.bind(this)
    this.getInputErrorText = this.getInputErrorText.bind(this)
    this.isButtonDisabled = this.isButtonDisabled.bind(this)
    this.renderButton = this.renderButton.bind(this)
    this.renderInput = this.renderInput.bind(this)
    this.renderApiError = this.renderApiError.bind(this)
  }

  validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  onInput(email: string) {
    if (this.props.onEnterValidEmail !== undefined) {
      this.props.onEnterValidEmail(email)
    }
    this.setState({ email: email })
  }

  isInputError() {
    return this.state.email.length > 0 && !this.validateEmail(this.state.email)
  }

  getInputErrorText() {
    return this.isInputError() ? i18n["incorrect_email"] : ""
  }

  isButtonDisabled() {
    return !this.validateEmail(this.state.email)
  }

  renderButton() {
    return (
      <button
        className="final-btn"
        disabled={this.isButtonDisabled()}
        onClick={this.props.onExit?.bind(this, this.state.email)}
      >
        <span>{i18n["final_send_btn"]}</span>
      </button>
    )
  }

  renderInput() {
    return (
      <input
        className={`final-input ${
          this.isInputError() ? "final-input-error" : ""
        }`}
        placeholder="e-mail"
        type="email"
        onChange={e => this.onInput(e.target.value)}
      />
    )
  }

  renderApiError() {
    return (
      <>
        {this.props.error && (
          <p className="api-error-text">{i18n["api_error"]}</p>
        )}
      </>
    )
  }

  render() {
    return (
      <div className="final-container">
        <div className="final-left-side">
          <h1 className="final-header">
            {i18n["final_header"]}
            <img className="waving-icon" src="final-icon.png" />
          </h1>
          <p className="final-desc">{i18n["final_desc"]}</p>
          <div className="final-input-group">
            <MediaQuery maxWidth={500}>{this.renderApiError()}</MediaQuery>
            {this.renderInput()}
            <MediaQuery minWidth={501}>{this.renderApiError()}</MediaQuery>
            <MediaQuery minWidth={501}>{this.renderButton()}</MediaQuery>
          </div>
        </div>
        <StaticImage
          className="final-img"
          src="../images/final.svg"
          alt=""
          placeholder="none"
          loading="eager"
        />
        <MediaQuery maxWidth={500}>{this.renderButton()}</MediaQuery>
      </div>
    )
  }
}
