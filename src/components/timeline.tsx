import React, { useEffect, useRef, useState } from "react";
import MediaQuery from "react-responsive";
import i18n from "../assets/i18n/locale/ru.json";
import "../css/timeline.css";

interface TimelineProps {
  time: number;
  defaultDayTime: number;
  maxDayTime: number;
  minDayTime: number;
  hidden?: boolean;
  onExit?: () => void;
  onReset?: () => void;
  onDayLengthChanged?: (value: number) => void;
}

export default function Timeline(props: TimelineProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dayBtnRef = useRef<HTMLButtonElement>(null);

  const [isDayLengthBtn, enableDayLengthBtn] = useState(false);
  const [dayTime, setDayTime] = useState(props.defaultDayTime);

  function handleClickEvent(event: any) {
    if (!inputRef.current?.contains(event.target) && !dayBtnRef.current?.contains(event.target) && isDayLengthBtn) {
      enableDayLengthBtn(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickEvent, false);
    return () => {
      document.removeEventListener("click", handleClickEvent, false);
    };
  }, [isDayLengthBtn]);

  function getTimeOverflow() {
    return props.time % dayTime;
  }

  function getHrs() {
    const h = Math.floor(getTimeOverflow() / 60);
    if (getTimeOverflow() == 0 && props.time > 0) {
      return Math.floor(dayTime / 60);
    }
    return h;
  }

  function getMins() {
    return Math.max(getTimeOverflow() - getHrs() * 60, 0);
  }

  function getDays() {
    const d = Math.floor(props.time / dayTime);
    if (getTimeOverflow() == 0) {
      return d - 1;
    }
    return d;
  }

  function getFillWidth() {
    const time = getMins() + getHrs() * 60;
    return Math.min(Math.round((time / dayTime) * 100), 100);
  }

  function getTimeString() {
    const hrs = getHrs();
    const mins = getMins();
    const hrs_str = `${hrs} ${i18n["hrs"]} `;
    const mins_str = `${mins} ${i18n["min"]}`;
    return `${hrs > 0 ? hrs_str : ""} ${mins > 0 ? mins_str : ""}`;
  }

  function getTimeOverflowString() {
    return `${getDays()} ${i18n["overflow_day"]}`;
  }

  function isTimeOverflow() {
    return props.time > dayTime;
  }

  function isHidden() {
    if (props.hidden !== undefined) {
      return props.hidden;
    }
    return props.time == 0;
  }

  function onInputChange(e: any) {
    const newDayTime = e.target.value;
    setDayTime(newDayTime);

    props.onDayLengthChanged?.(newDayTime);
  }

  function onDayLengthBtn() {
    inputRef.current?.focus();
    enableDayLengthBtn(!isDayLengthBtn);
  }

  function renderDayLengthBtn() {
    return (
      <div className="daylength-container">
        <button
          ref={dayBtnRef}
          className={`daylength-btn ${isDayLengthBtn ? "selected-daylength-btn" : ""}`}
          onClick={onDayLengthBtn}
        >
          <span>{`${dayTime / 60} ${i18n["hrs"]}`}</span>
          <div className="sun-circle">
            <img className="daylength-icon" src="sun_icon.svg" />
          </div>
        </button>
        <span
          className="daylength-input-container"
          ref={inputRef}
          style={{
            opacity: !isHidden() && isDayLengthBtn ? 1 : 0,
            visibility: !isHidden() && isDayLengthBtn ? "visible" : "hidden",
          }}
        >
          <p>{i18n["all_day"]}:</p>
          <p>{`${dayTime / 60} ${i18n["hrs"]}`}</p>
          <input
            style={
              {
                "--ratio": (dayTime - props.minDayTime) / (props.maxDayTime - props.minDayTime),
              } as React.CSSProperties
            }
            className="daylength-input"
            type="range"
            onChange={onInputChange}
            max={props.maxDayTime}
            min={props.minDayTime}
            value={dayTime}
            step={60}
          />
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        transform: `translateY(${isHidden() ? "100%" : "0%"})`,
      }}
      className="timeline"
    >
      <div className="timeline-container">
        <div className="full-time-bar">
          {isTimeOverflow() && (
            <div className="timeline-side">
              <p>{getTimeOverflowString()}</p>
              <div className="timeline-side-bar" />
            </div>
          )}
          <div className="time-bar-container">
            <div className="bar-header">
              <p>{getTimeString()}</p>
              <p>{i18n["trip_length"]}</p>
              <p>{i18n["all_day"]}</p>
            </div>
            <div className="time-bar">
              <div className="time-bar-outer" />
              <div style={{ width: `${getFillWidth()}%` }} className="time-bar-fill" />
            </div>
          </div>
        </div>
        {renderDayLengthBtn()}
        <button className="reset-btn" onClick={props.onReset}>
          <span>
            <MediaQuery minWidth={576}>{i18n["reset_places"]}</MediaQuery>
            <img className="reset-icon" src="reset_icon.svg" />
          </span>
        </button>
        <button className="places-btn" onClick={props.onExit}>
          <span>{i18n["create_trip"]}</span>
        </button>
      </div>
    </div>
  );
}
