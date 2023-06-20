import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import i18n from "../assets/i18n/locale/ru.json";
import "../css/final.css";
import MediaQuery from "react-responsive";

interface FinalPageProps {
  onMiss?: () => void;
  onExit?: () => void;
}

export default function FinalPage(props: FinalPageProps) {
  function renderBtnGroup() {
    return (
      <div className="final-btn-group">
        <button className="final-btn" onClick={props.onExit}>
          <span>{i18n["final_btn"]}</span>
        </button>
        <p className="final-miss-btn" onClick={props.onMiss}>
          {i18n["final_miss_btn"]}
        </p>
      </div>
    );
  }

  return (
    <div className="final-container">
      <div className="final-left-side">
        <h1 className="final-header">{i18n["final_header"]}</h1>
        <p className="final-desc">{i18n["final_desc"]}</p>
        <MediaQuery minWidth={501}>{renderBtnGroup()}</MediaQuery>
      </div>
      <StaticImage
        className="final-img"
        src="../assets/images/svg/final.svg"
        alt=""
        placeholder="none"
        loading="eager"
      />
      <MediaQuery maxWidth={500}>{renderBtnGroup()}</MediaQuery>
    </div>
  );
}
