import React from "react"
import { PlaceData } from "./app"
import i18n from "../i18n/ru.json"
import "../css/place-card.css"

interface IProps {
  label: string
  score: number
  placeData: PlaceData
  showInfo: boolean
  onInfoClick?: (e: any) => void
  onClick?: (checked: boolean, e: any) => void
}

interface IState {
  checked: boolean
}

export default class PlaceCard extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { checked: false }
  }

  onClick(e: any) {
    this.setState({ checked: !this.state.checked })
    if (this.props.onClick) {
      this.props.onClick(this.state.checked, e)
    }
  }

  render() {
    return (
      <div
        className={`place-card ${
          this.state.checked ? "place-checked" : "card-grad"
        }`}
        onClick={this.onClick.bind(this)}
      >
        {this.state.checked && (
          <img className="selected-icon" src="selected_icon.svg" />
        )}
        <img
          className="info-icon"
          src="info_icon.svg"
          onClick={this.props.onInfoClick}
        />
        <div className="card-img">
          <img
            src={`photo/${this.props.placeData.photo}.jpg`}
            alt={this.props.label}
          />
        </div>
        <div className="card-label">
          <p className="debug-score">{`Score: ${this.props.score}`}</p>
          <div className="time-label">
            <img src="time_icon.svg" />
            <p>{`${this.props.placeData.ttv} ${i18n["min"]}`}</p>
          </div>
          <p className="name-label">{this.props.label}</p>
        </div>
        {this.props.showInfo && (
          <div className="info-card" onClick={e => e.stopPropagation()}>
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
        )}
      </div>
    )
  }
}
