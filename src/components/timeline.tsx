import React from "react"
import MediaQuery from "react-responsive"
import i18n from "../i18n/ru.json"
import "../css/timeline.css"

interface IProps {
  time: number
  defaultDayTime: number
  maxDayTime: number
  minDayTime: number
  hidden?: boolean
  onExit?: () => void
  onReset?: () => void
  onDayLengthChanged?: (value: number) => void
}

interface IState {
  isDayLengthBtn: boolean
  dayTime: number
}

export default class Timeline extends React.Component<IProps, IState> {
  inputRef: any
  dayBtnRef: any
  constructor(props: IProps) {
    super(props)

    this.getTimeOverflow = this.getTimeOverflow.bind(this)
    this.getHrs = this.getHrs.bind(this)
    this.getMins = this.getMins.bind(this)
    this.getDays = this.getDays.bind(this)
    this.getFillWidth = this.getFillWidth.bind(this)
    this.getTimeString = this.getTimeString.bind(this)
    this.getTimeOverflowString = this.getTimeOverflowString.bind(this)
    this.isTimeOverflow = this.isTimeOverflow.bind(this)
    this.isHidden = this.isHidden.bind(this)
    this.onDayLengthBtn = this.onDayLengthBtn.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.renderDayLengthBtn = this.renderDayLengthBtn.bind(this)
    this.handleClickEvent = this.handleClickEvent.bind(this)
    this.inputRef = React.createRef()
    this.dayBtnRef = React.createRef()

    this.state = { isDayLengthBtn: false, dayTime: this.props.defaultDayTime }
  }

  handleClickEvent(event: any) {
    if (
      !this.inputRef.current?.contains(event.target) &&
      !this.dayBtnRef.current?.contains(event.target) &&
      this.state.isDayLengthBtn
    ) {
      this.setState({ isDayLengthBtn: false })
    }
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClickEvent, false)
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickEvent, false)
  }

  getTimeOverflow() {
    return this.props.time % this.state.dayTime
  }

  getHrs() {
    const h = Math.floor(this.getTimeOverflow() / 60)
    if (this.getTimeOverflow() == 0 && this.props.time > 0) {
      return Math.floor(this.state.dayTime / 60)
    }
    return h
  }

  getMins() {
    return Math.max(this.getTimeOverflow() - this.getHrs() * 60, 0)
  }

  getDays() {
    const d = Math.floor(this.props.time / this.state.dayTime)
    if (this.getTimeOverflow() == 0) {
      return d - 1
    }
    return d
  }

  getFillWidth() {
    const time = this.getMins() + this.getHrs() * 60
    return Math.min(Math.round((time / this.state.dayTime) * 100), 100)
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
    return this.props.time > this.state.dayTime
  }

  isHidden() {
    if (this.props.hidden !== undefined) {
      return this.props.hidden
    }
    return this.props.time == 0
  }

  onInputChange(e: any) {
    const el = e.target
    this.setState({ dayTime: el.value })
    if (this.props.onDayLengthChanged !== undefined) {
      this.props.onDayLengthChanged(el.value)
    }
  }

  onDayLengthBtn() {
    this.inputRef.current.focus()
    this.setState({ isDayLengthBtn: !this.state.isDayLengthBtn })
  }

  renderDayLengthBtn() {
    return (
      <div className="daylength-container">
        <button
          ref={this.dayBtnRef}
          className={`daylength-btn ${
            this.state.isDayLengthBtn ? "selected-daylength-btn" : ""
          }`}
          onClick={this.onDayLengthBtn}
        >
          <span>{`${this.state.dayTime / 60} ${i18n["hrs"]}`}</span>
          <div className="sun-circle">
            <img className="daylength-icon" src="sun_icon.svg" />
          </div>
        </button>
        <span
          className="daylength-input-container"
          ref={this.inputRef}
          style={{
            opacity: !this.isHidden() && this.state.isDayLengthBtn ? 1 : 0,
            visibility:
              !this.isHidden() && this.state.isDayLengthBtn
                ? "visible"
                : "hidden",
          }}
        >
          <p>{i18n["all_day"]}:</p>
          <p>{`${this.state.dayTime / 60} ${i18n["hrs"]}`}</p>
          <input
            style={
              {
                "--ratio":
                  (this.state.dayTime - this.props.minDayTime) /
                  (this.props.maxDayTime - this.props.minDayTime),
              } as React.CSSProperties
            }
            className="daylength-input"
            type="range"
            onChange={this.onInputChange}
            max={this.props.maxDayTime}
            min={this.props.minDayTime}
            value={this.state.dayTime}
            step={60}
          />
        </span>
      </div>
    )
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
          <div className="full-time-bar">
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
          </div>
          {this.renderDayLengthBtn()}
          <button className="reset-btn" onClick={this.props.onReset}>
            <span>
              <MediaQuery minWidth={576}>{i18n["reset_places"]}</MediaQuery>
              <img className="reset-icon" src="reset_icon.svg" />
            </span>
          </button>
          <button className="places-btn" onClick={this.props.onExit}>
            <span>{i18n["create_trip"]}</span>
          </button>
        </div>
      </div>
    )
  }
}
