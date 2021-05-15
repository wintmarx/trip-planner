import React from "react"
import { ThemeButton } from "./theme-button"
import i18n from "../i18n/ru.json"
import "../css/timeline.css"

interface IProps {
  time: number
  dayTime: number
  hidden?: boolean
  onExitCb?: () => void
}

export default class Timeline extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  getFillWidth() {
    var perc = Math.round((this.props.time / this.props.dayTime) * 100)
    if (perc > 100) {
      return 100
    }
    return perc
  }

  getTimeString() {
    const hrs = Math.floor(this.props.time / 60)
    const mins = this.props.time % 60
    const hrs_str = `${hrs} ${i18n["hrs"]} `
    const mins_str = `${mins} ${i18n["min"]}`
    return `${hrs > 0 ? hrs_str : ""} ${mins > 0 ? mins_str : ""}`
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
          <ThemeButton className="places-btn" onClick={this.props.onExitCb}>
            {i18n["next_page"]}
          </ThemeButton>
        </div>
      </div>
    )
  }
}
