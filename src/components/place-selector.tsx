import React, { MouseEventHandler } from "react"
import { ThemeButton } from "./theme-button"
import { Tags } from "./app"
import { PlaceData } from "./app"
import i18n from "../i18n/ru.json"
import "../css/place-selector.css"

type PlaceState = {
  checked: boolean
  label: string
  score: number
  placeData: PlaceData
}

interface IProps {
  onExitCb: () => void
  selTags: Tags
  places: PlaceData[]
}

interface IState {
  checkboxes: PlaceState[]
  infoIndex: number
}

export default class PlaceSelector extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    var dict: { [id: string]: number } = {}

    this.props.places.forEach(place => {
      const pMatch = place.tags.places.filter(tag =>
        this.props.selTags.places.includes(tag)
      ).length
      const tMatch = place.tags.themes.filter(tag =>
        this.props.selTags.themes.includes(tag)
      ).length
      dict[place.name] =
        3 * pMatch +
        2 * tMatch +
        (place.gmRating + place.taRating) / 5 +
        Math.log10(place.gmReviewsCnt + place.taReviewsCnt + 1) / 2
    })

    const sorted = this.props.places.sort((a: PlaceData, b: PlaceData) => {
      return dict[b.name] - dict[a.name]
    })

    const checkboxes: PlaceState[] = sorted.map(
      place =>
        ({
          checked: false,
          label: place.name,
          score: dict[place.name],
          placeData: place,
        } as PlaceState)
    )

    this.state = { checkboxes: checkboxes, infoIndex: -1 }
  }

  toggleCheckbox(index: number) {
    const { checkboxes } = this.state
    checkboxes[index].checked = !checkboxes[index].checked
    this.setState({ checkboxes: checkboxes })
  }

  onClickInfo(index: number, e: any) {
    e.stopPropagation()
    if (index == this.state.infoIndex) {
      index = -1
    }
    this.setState({ infoIndex: index })
  }

  renderCheckboxes() {
    return this.state.checkboxes.map((checkbox, index) => (
      <div
        key={index}
        className={`place-card ${
          checkbox.checked ? "place-checked" : "card-grad"
        }`}
        onClick={this.toggleCheckbox.bind(this, index)}
      >
        {checkbox.checked && (
          <img className="selected-icon" src="selected_icon.svg" />
        )}
        <img
          className="info-icon"
          src="info_icon.svg"
          onClick={this.onClickInfo.bind(this, index)}
        />
        <div className="card-img">
          <img
            src={`photo/${checkbox.placeData.photo}.jpg`}
            alt={checkbox.label}
          />
        </div>
        <div className="card-label">
          <p className="debug-score">{`Score: ${checkbox.score}`}</p>
          <div className="time-label">
            <img src="time_icon.svg" />
            <p>{`${checkbox.placeData.ttv} ${i18n["min"]}`}</p>
          </div>
          <p className="name-label">{checkbox.label}</p>
        </div>
        {index == this.state.infoIndex && (
          <div className="info-card" onClick={e => e.stopPropagation()}>
            <div>
              <h1>{i18n["info_header"]}</h1>
              <img
                className="close-icon"
                src="close_icon.svg"
                onClick={this.onClickInfo.bind(this, index)}
              />
            </div>
            <p>{checkbox.placeData.description}</p>
          </div>
        )}
      </div>
    ))
  }

  render() {
    return (
      <>
        <h3 className="places-header">{i18n["select_places"]}</h3>
        <div className="cards-container">
          {this.renderCheckboxes.call(this)}
        </div>
        <ThemeButton className="place-btn" onClick={this.props.onExitCb}>
          {i18n["next_page"]} →
        </ThemeButton>
      </>
    )
  }
}
