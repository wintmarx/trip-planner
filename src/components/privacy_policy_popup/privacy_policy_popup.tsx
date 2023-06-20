import React from "react";
import i18n from "../../assets/i18n/locale/ru.json";
import "./privacy_policy_popup.css";

interface PrivacyPolicyPopupProps {
  onExit?: () => void;
  onInfo?: () => void;
}

export default function PrivacyPolicyPopup(props: PrivacyPolicyPopupProps) {
  return (
    <div className="policy-popup">
      <div className="policy-popup-container">
        <p className="policy-popup-desc">{i18n["privacy_policy_popup"]}</p>
        <button className="more-policy-popup-btn" onClick={props.onInfo}>
          <span>{i18n["more"]}</span>
        </button>
        <button className="policy-popup-btn" onClick={props.onExit}>
          <span>{i18n["ok"]}</span>
        </button>
      </div>
    </div>
  );
}
