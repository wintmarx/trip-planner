import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import i18n from "../assets/i18n/locale/ru.json";
import "../css/email.css";
import MediaQuery from "react-responsive";

interface IProps {
  onEnterValidEmail?: (email: string) => void;
  onSend?: (email: string) => void;
  error?: boolean;
}

interface IState {
  email: string;
  emailValid: boolean;
}

export default class Email extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { email: "", emailValid: true };

    this.onInput = this.onInput.bind(this);
    this.isInputError = this.isInputError.bind(this);
    this.getInputErrorText = this.getInputErrorText.bind(this);
    this.isButtonDisabled = this.isButtonDisabled.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderApiError = this.renderApiError.bind(this);
  }

  validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  onInput(email: string) {
    if (this.props.onEnterValidEmail !== undefined) {
      this.props.onEnterValidEmail(email);
    }
    this.setState({ email: email });
  }

  isInputError() {
    return this.state.email.length > 0 && !this.validateEmail(this.state.email);
  }

  getInputErrorText() {
    return this.isInputError() ? i18n["incorrect_email"] : "";
  }

  isButtonDisabled() {
    return !this.validateEmail(this.state.email);
  }

  renderButton() {
    return (
      <button
        className="email-btn"
        disabled={this.isButtonDisabled()}
        onClick={this.props.onSend?.bind(this, this.state.email)}
      >
        <span>{i18n["email_send_btn"]}</span>
      </button>
    );
  }

  renderInput() {
    return (
      <input
        className={`email-input ${this.isInputError() ? "email-input-error" : ""}`}
        placeholder="e-mail"
        type="email"
        onChange={e => this.onInput(e.target.value)}
      />
    );
  }

  renderApiError() {
    return <>{this.props.error && <p className="api-error-text">{i18n["api_error"]}</p>}</>;
  }

  render() {
    return (
      <div className="email-container">
        <div className="email-left-side">
          <h1 className="email-header">
            {i18n["email_header"]}
            <img className="waving-icon" src="final-icon.png" />
          </h1>
          <p className="email-desc">{i18n["email_desc"]}</p>
          <div className="email-input-group">
            <MediaQuery maxWidth={500}>{this.renderApiError()}</MediaQuery>
            {this.renderInput()}
            <MediaQuery minWidth={501}>{this.renderApiError()}</MediaQuery>
            <MediaQuery minWidth={501}>{this.renderButton()}</MediaQuery>
          </div>
        </div>
        <StaticImage
          className="email-img"
          src="../assets/images/svg/final.svg"
          alt=""
          placeholder="none"
          loading="eager"
        />
        <MediaQuery maxWidth={500}>{this.renderButton()}</MediaQuery>
      </div>
    );
  }
}
