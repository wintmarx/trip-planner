import React, { useEffect, useState } from "react";
import i18n from "../../assets/i18n/locale/ru.json";
import "./sn_services.css";
import VKLogo from "../../assets/images/svg/vk_logo.svg";
import InstagramLogo from "../../assets/images/svg/instagram_logo.svg";
import FacebookLogo from "../../assets/images/svg/facebook_logo.svg";

type SNSProfileState = {
  profile: string;
  isValid: boolean;
};

type SetProfileStateCb = React.Dispatch<React.SetStateAction<SNSProfileState>>;

export type SNSProfiles = {
  vk: string;
  fb: string;
  inst: string;
};

interface SNServicesProps {
  onExit?: (profiles: SNSProfiles) => void;
  onSkip?: () => void;
}

function isInputValid(profile: string) {
  // const re = /^([A-Za-z0-9-_\.]+)$/
  // return profile.length == 0 || re.test(profile)
  return true;
}

function onChangeInput(newValue: string, setState: SetProfileStateCb) {
  setState({ profile: newValue, isValid: isInputValid(newValue) });
}

function renderInput(inputName: string, isValid: boolean, setState: SetProfileStateCb) {
  return (
    <input
      className={`sns-input ${!isValid ? "sns-input-error" : ""}`}
      placeholder={inputName}
      type="url"
      onChange={(e) => onChangeInput(e.target.value, setState)}
    />
  );
}

export default function SNServices(props: SNServicesProps) {
  const defaultState: SNSProfileState = { profile: "", isValid: true };

  const [vkState, setVkState] = useState(defaultState);
  const [fbState, setFbState] = useState(defaultState);
  const [instState, setInstState] = useState(defaultState);

  useEffect(() => {
    document?.querySelector("body")?.scrollTo(0, 0);
  }, []);

  function isButtonDisabled() {
    return !fbState.isValid || !vkState.isValid || !instState.isValid;
  }

  function onExit() {
    const profiles: SNSProfiles = {
      vk: vkState.isValid ? vkState.profile : "",
      fb: fbState.isValid ? fbState.profile : "",
      inst: instState.isValid ? instState.profile : "",
    };

    props.onExit?.(profiles);
  }

  return (
    <>
      <h1 className="sns-header">{i18n["sns_header"]}</h1>
      <p className="sns-desc">{i18n["sns_desc"]}</p>
      <div className="sns-container">
        <VKLogo className="sns-icon" />
        {renderInput(i18n["vk"], vkState.isValid, setVkState)}
        <InstagramLogo className="sns-icon" />
        {renderInput(i18n["instagram"], instState.isValid, setInstState)}
        <FacebookLogo className="sns-icon" />
        {renderInput(i18n["facebook"], fbState.isValid, setFbState)}
      </div>
      <div className="sns-btn-container">
        <button className="sns-skip-btn" onClick={props.onSkip}>
          <span>{i18n["skip"]}</span>
        </button>
        <button className="sns-btn" onClick={onExit} disabled={isButtonDisabled()}>
          <span>{i18n["next_page"]} →</span>
        </button>
      </div>
    </>
  );
}
