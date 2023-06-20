import React from "react";
import { PlaceData } from "./app";
import i18n from "../assets/i18n/locale/ru.json";
import placesIntl from "../assets/i18n/places/ru.json";
import "../css/place-card.css";

interface PlaceCardProps {
  label: string;
  score: number;
  placeData: PlaceData;
  showInfo: boolean;
  checked: boolean;
  debug?: boolean;
  style?: React.CSSProperties;
  onInfoClick?: (e: any) => void;
  onClick?: (checked: boolean, e: any) => void;
}

export default function PlaceCard(props: PlaceCardProps) {
  return (
    <div
      style={props.style}
      className={`place-card ${props.checked ? "place-checked" : "card-grad"}`}
      onClick={props.onClick?.bind(null, !props.checked)}
    >
      {props.checked && <img className="selected-icon" src="selected_icon.svg" />}
      <img className="info-icon" src="info_icon.svg" onClick={props.onInfoClick} />
      <div className="card-img">
        <img src={props.placeData.photo} alt={props.label} />
      </div>
      <div className="card-label">
        {props.debug !== undefined && props.debug && <p className="debug-score">{`Score: ${props.score}`}</p>}
        <div className="time-label">
          <img src="time_icon.svg" />
          <p>{`${props.placeData.ttv} ${i18n["min"]}`}</p>
        </div>
        <p className="name-label">{props.label}</p>
      </div>
      <div
        className="info-card"
        style={{
          opacity: props.showInfo ? 1 : 0,
          visibility: props.showInfo ? "visible" : "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h1>{i18n["info_header"]}</h1>
          <img className="close-icon" src="close_icon.svg" onClick={props.onInfoClick} />
        </div>
        <p>{placesIntl.find((el) => el.id == props.placeData.id)?.desc || "description"}</p>
      </div>
    </div>
  );
}
