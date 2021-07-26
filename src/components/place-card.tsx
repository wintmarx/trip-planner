import React from "react"
import { PlaceData } from "./app"
import i18n from "../i18n/ru.json"
import "../css/place-card.css"

interface IProps {
  label: string
  score: number
  placeData: PlaceData
  showInfo: boolean
  checked: boolean
  debug?: boolean
  onInfoClick?: (e: any) => void
  onClick?: (checked: boolean, e: any) => void
}

export default class PlaceCard extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      checked: props.checked,
    }
  }

  onClick(e: any) {
    if (this.props.onClick !== undefined) {
      this.props.onClick(!this.props.checked, e)
    }
  }

  render() {
    return (
      <div
        className={`place-card ${
          this.props.checked ? "place-checked" : "card-grad"
        }`}
        onClick={this.onClick.bind(this)}
      >
        {this.props.checked && (
          <img className="selected-icon" src="selected_icon.svg" />
        )}
        <img
          className="info-icon"
          src="info_icon.svg"
          onClick={this.props.onInfoClick}
        />
        <div className="card-img">
          <img src={this.props.placeData.photo} alt={this.props.label} />
        </div>
        <div className="card-label">
          {this.props.debug !== undefined && this.props.debug && (
            <p className="debug-score">{`Score: ${this.props.score}`}</p>
          )}
          <div className="time-label">
            <img src="time_icon.svg" />
            <p>{`${this.props.placeData.ttv} ${i18n["min"]}`}</p>
          </div>
          <p className="name-label">{this.props.label}</p>
        </div>
        <div
          className="info-card"
          style={{
            opacity: this.props.showInfo ? 1 : 0,
            visibility: this.props.showInfo ? "visible" : "hidden",
          }}
          onClick={e => e.stopPropagation()}
        >
          <div>
            <h1>{i18n["info_header"]}</h1>
            <img
              className="close-icon"
              src="close_icon.svg"
              onClick={this.props.onInfoClick}
            />
          </div>
          <p>{this.props.placeData.description}</p>
        </div>
      </div>
    )
  }
}
