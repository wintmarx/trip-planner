import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import i18n from "../assets/i18n/locale/ru.json";
import "../css/greetings.css";
import MediaQuery from "react-responsive";

interface GreetingsPageProps {
  onExit: () => void;
}

export default function GreetingsPage(props: GreetingsPageProps) {
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
        <MediaQuery minWidth={501}>
          <button className="greet-btn" onClick={props.onExit}>
            <span>
              {i18n["create_trip_btn"]}
              <img className="sparkles-icon" src="sparkles.png" />
            </span>
          </button>
        </MediaQuery>
      </div>
      <StaticImage
        className="greet-img"
        src="../assets/images/svg/illustration.svg"
        alt=""
        placeholder="none"
        loading="eager"
      />

      <MediaQuery maxWidth={500}>
        <button className="greet-btn" onClick={props.onExit}>
          <span>
            {i18n["create_trip_btn"]}
            <img className="sparkles-icon" src="sparkles.png" />
          </span>
        </button>
      </MediaQuery>
    </div>
  );
}
