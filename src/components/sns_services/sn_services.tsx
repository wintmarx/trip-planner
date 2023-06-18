import React from "react";
import i18n from "../../assets/i18n/locale/ru.json";
import "./sn_services.css";
import VKLogo from "../../assets/images/svg/vk_logo.svg";
import InstagramLogo from "../../assets/images/svg/instagram_logo.svg";
import FacebookLogo from "../../assets/images/svg/facebook_logo.svg";

type SNSProfileState = {
  profile: string;
  isValid: boolean;
};

export type SNSProfiles = {
  vk: string;
  fb: string;
  inst: string;
};

interface IProps {
  onExit?: (profiles: SNSProfiles) => void;
  onSkip?: () => void;
}

interface IState {
  vk: SNSProfileState;
  fb: SNSProfileState;
  inst: SNSProfileState;
}

export default class SNServices extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
    this.onVKChange = this.onVKChange.bind(this);
    this.onInstChange = this.onInstChange.bind(this);
    this.onFBChange = this.onFBChange.bind(this);
    this.onExit = this.onExit.bind(this);
    this.isButtonDisabled = this.isButtonDisabled.bind(this);

    this.state = {
      vk: { profile: "", isValid: true },
      fb: { profile: "", isValid: true },
      inst: { profile: "", isValid: true },
    };
  }

  componentDidMount() {
    document?.querySelector("body")?.scrollTo(0, 0);
  }

  isInputValid(profile: string) {
    // const re = /^([A-Za-z0-9-_\.]+)$/
    // return profile.length == 0 || re.test(profile)
    return true;
  }

  onVKChange(profile: string) {
    this.setState({
      vk: { profile: profile, isValid: this.isInputValid(profile) },
    });
  }

  onInstChange(profile: string) {
    this.setState({
      inst: { profile: profile, isValid: this.isInputValid(profile) },
    });
  }

  onFBChange(profile: string) {
    this.setState({
      fb: { profile: profile, isValid: this.isInputValid(profile) },
    });
  }

  isButtonDisabled() {
    return !this.state.fb.isValid || !this.state.vk.isValid || !this.state.inst.isValid;
  }

  onExit() {
    const profiles: SNSProfiles = {
      vk: this.state.vk.isValid ? this.state.vk.profile : "",
      fb: this.state.fb.isValid ? this.state.fb.profile : "",
      inst: this.state.inst.isValid ? this.state.inst.profile : "",
    };

    this.props.onExit?.call(this, profiles);
  }

  renderInput(name: string, onChange: (profile: string) => void, isValid: boolean) {
    return (
      <input
        className={`sns-input ${!isValid ? "sns-input-error" : ""}`}
        placeholder={name}
        type="url"
        onChange={e => onChange(e.target.value)}
      />
    );
  }

  render() {
    return (
      <>
        <h1 className="sns-header">{i18n["sns_header"]}</h1>
        <p className="sns-desc">{i18n["sns_desc"]}</p>
        <div className="sns-container">
          <VKLogo className="sns-icon" />
          {this.renderInput(i18n["vk"], this.onVKChange, this.state.vk.isValid)}
          <InstagramLogo className="sns-icon" />
          {this.renderInput(i18n["instagram"], this.onInstChange, this.state.inst.isValid)}
          <FacebookLogo className="sns-icon" />
          {this.renderInput(i18n["facebook"], this.onFBChange, this.state.fb.isValid)}
        </div>
        <div className="sns-btn-container">
          <button className="sns-skip-btn" onClick={this.props.onSkip}>
            <span>{i18n["skip"]}</span>
          </button>
          <button className="sns-btn" onClick={this.onExit} disabled={this.isButtonDisabled()}>
            <span>{i18n["next_page"]} →</span>
          </button>
        </div>
      </>
    );
  }
}
