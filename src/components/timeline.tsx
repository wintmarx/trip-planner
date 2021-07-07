import React from "react"
import { ThemeButton, TimelineButton } from "./theme-button"
import MediaQuery from "react-responsive"
import i18n from "../i18n/ru.json"
import "../css/timeline.css"

interface IProps {
  time: number
  dayTime: number
  hidden?: boolean
  onExit?: () => void
  onReset?: () => void
}

export default class Timeline extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  getTimeOverflow() {
    return this.props.time % this.props.dayTime
  }

  getHrs() {
    const h = Math.floor(this.getTimeOverflow() / 60)
    if (this.getTimeOverflow() == 0 && this.props.time > 0) {
      return Math.floor(this.props.dayTime / 60)
    }
    return h
  }

  getMins() {
    return Math.max(this.getTimeOverflow() - this.getHrs() * 60, 0)
  }

  getDays() {
    const d = Math.floor(this.props.time / this.props.dayTime)
    if (this.getTimeOverflow() == 0) {
      return d - 1
    }
    return d
  }

  getFillWidth() {
    const time = this.getMins() + this.getHrs() * 60
    return Math.min(Math.round((time / this.props.dayTime) * 100), 100)
  }

  getTimeString() {
    const hrs = this.getHrs()
    const mins = this.getMins()
    const hrs_str = `${hrs} ${i18n["hrs"]} `
    const mins_str = `${mins} ${i18n["min"]}`
    return `${hrs > 0 ? hrs_str : ""} ${mins > 0 ? mins_str : ""}`
  }

  getTimeOverflowString() {
    return `${this.getDays()} ${i18n["overflow_day"]}`
  }

  isTimeOverflow() {
    return this.props.time > this.props.dayTime
  }

  isHidden() {
    if (this.props.hidden !== undefined) {
      return this.props.hidden
    }
    return this.props.time == 0
  }

  render() {
    return (
      <div
        style={{
          transform: `translateY(${this.isHidden.call(this) ? "100%" : "0%"})`,
        }}
        className="timeline"
      >
        <div className="timeline-container">
          {this.isTimeOverflow.call(this) && (
            <div className="timeline-side">
              <p>{this.getTimeOverflowString.call(this)}</p>
              <div className="timeline-side-bar" />
            </div>
          )}
          <div className="time-bar-container">
            <div className="bar-header">
              <p>{this.getTimeString.call(this)}</p>
              <p>{i18n["trip_length"]}</p>
              <p>{i18n["all_day"]}</p>
            </div>
            <div className="time-bar">
              <div className="time-bar-outer" />
              <div
                style={{ width: `${this.getFillWidth.call(this)}%` }}
                className="time-bar-fill"
              />
            </div>
          </div>
          <TimelineButton className="reset-btn" onClick={this.props.onReset}>
            <MediaQuery minWidth={800}>{i18n["reset_places"]}</MediaQuery>
            <img className="reset-icon" src="reset_icon.svg" />
          </TimelineButton>
          <TimelineButton className="places-btn" onClick={this.props.onExit}>
            {i18n["create_trip"]}
          </TimelineButton>
        </div>
      </div>
    )
  }
}
