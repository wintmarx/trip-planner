import React, { useState } from "react";
import { StaticImage } from "gatsby-plugin-image";
import i18n from "../assets/i18n/locale/ru.json";
import "../css/email.css";
import MediaQuery from "react-responsive";

const smBreakpoint = 700;

interface EmailPageProps {
  onEnterValidEmail?: (email: string) => void;
  onSend?: (email: string) => void;
  error?: boolean;
}

let errorCounter = 0;

export default function EmailPage(props: EmailPageProps) {
  const [email, setEmail] = useState("");

  if (props.error) {
    if (errorCounter < 2) {
      errorCounter++;
    }
  } else {
    errorCounter = 0;
  }

  console.log(errorCounter);

  function validateEmail(email: string) {
    const emailRegExp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegExp.test(email.toLowerCase());
  }

  function onInput(newEmail: string) {
    props.onEnterValidEmail?.(newEmail);
    setEmail(newEmail);
  }

  function isInputError() {
    return email.length > 0 && !validateEmail(email);
  }

  function getInputErrorText() {
    return isInputError() ? i18n["incorrect_email"] : "";
  }

  function isButtonDisabled() {
    return !validateEmail(email);
  }

  function renderButton() {
    return (
      <button
        className="email-btn"
        disabled={isButtonDisabled()}
        onClick={() => {
          errorCounter = 0;
          props.onSend?.(email);
        }}
      >
        <span>{i18n["email_send_btn"]}</span>
      </button>
    );
  }

  function renderInput() {
    return (
      <input
        className={`email-input ${isInputError() ? "email-input-error" : ""}`}
        placeholder="email"
        type="email"
        onChange={(e) => onInput(e.target.value)}
      />
    );
  }

  function renderErrorText() {
    if (props.error && errorCounter == 1) {
      return <p className="input-error-text">{i18n["api_error"]}</p>;
    }
    return <p className="input-error-text email-error-text">{getInputErrorText()}</p>;
  }

  return (
    <div className="email-container">
      <div className="email-left-side">
        <h1 className="email-header">
          {i18n["email_header"]}
          <img className="waving-icon" src="final-icon.png" />
        </h1>
        <p className="email-desc">{i18n["email_desc"]}</p>
        <div className="email-input-group">
          <MediaQuery maxWidth={smBreakpoint}>{renderErrorText()}</MediaQuery>
          {renderInput()}
          <MediaQuery minWidth={smBreakpoint + 1}>{renderErrorText()}</MediaQuery>
          <MediaQuery minWidth={smBreakpoint + 1}>{renderButton()}</MediaQuery>
        </div>
      </div>
      <StaticImage
        className="email-img"
        src="../assets/images/svg/final.svg"
        alt="email-logo"
        placeholder="none"
        loading="eager"
      />
      <MediaQuery maxWidth={smBreakpoint}>{renderButton()}</MediaQuery>
    </div>
  );
}
