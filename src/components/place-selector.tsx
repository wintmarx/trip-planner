import React from "react"
import { ThemeButton } from "./theme-button"
import { Tags } from "./app"
import { PlaceData } from "./app"
import i18n from "../i18n/ru.json"
import "../css/place-selector.css"
import PlaceCard from "./place-card"
import Timeline from "./timeline"

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
  cards: PlaceState[]
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

    const cards: PlaceState[] = sorted.map(
      place =>
        ({
          checked: false,
          label: place.name,
          score: dict[place.name],
          placeData: place,
        } as PlaceState)
    )

    this.state = { cards: cards, infoIndex: -1 }
  }

  onCardClick(index: number, checked: boolean, e: any) {
    const { cards } = this.state
    cards[index].checked = checked
    this.setState({ cards: cards })
  }

  onClickInfo(index: number, e: any) {
    e.stopPropagation()
    if (index == this.state.infoIndex) {
      index = -1
    }
    this.setState({ infoIndex: index })
  }

  renderCards() {
    return this.state.cards.map((checkbox, index) => (
      <React.Fragment key={index}>
        <PlaceCard
          label={checkbox.label}
          score={checkbox.score}
          placeData={checkbox.placeData}
          showInfo={index == this.state.infoIndex}
          onInfoClick={this.onClickInfo.bind(this, index)}
          onClick={this.onCardClick.bind(this, index)}
        />
      </React.Fragment>
    ))
  }

  getConsumedTime() {
    var time = 0
    this.state.cards
      .filter(card => card.checked)
      .forEach(it => (time += it.placeData.ttv))
    return time
  }

  isTimelineHidden() {
    return this.getConsumedTime.call(this) == 0
  }

  render() {
    return (
      <>
        <h3 className="places-header">{i18n["select_places"]}</h3>
        <div
          style={{
            marginBottom: `${
              this.isTimelineHidden.call(this) ? "inherit" : "max(10vh, 100px)"
            }`,
          }}
          className="cards-container"
        >
          {this.renderCards.call(this)}
        </div>
        <Timeline
          hidden={this.isTimelineHidden.call(this)}
          time={this.getConsumedTime.call(this)}
          dayTime={600}
          onExitCb={this.props.onExitCb}
        />
      </>
    )
  }
}
