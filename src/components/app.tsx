import React from "react"
import TagsSelector from "./tags-selector"
import Final from "./final"
import Greetings from "./greetings"
import Layout from "./layout"
import PlaceSelector from "./place-selector"
import i18n from "../i18n/ru.json"
import ym from "react-yandex-metrika"

enum Page {
  Greetings,
  PlaceTags,
  ThemeTags,
  Places,
  Final,
  Loading,
}

export type Tags = {
  places: string[]
  themes: string[]
}

export type PlaceData = {
  id: string
  name: string
  description: string
  photo: string
  ttv: number
  tags: Tags
  gmReviewsCnt: number
  gmRating: number
  taReviewsCnt: number
  taRating: number
}

interface IProps {
  places: PlaceData[]
  tags: Tags
}

interface IState {
  page: Page
  selTags: Tags
  selPlaces: string[]
}

const STORAGE_NAME = "trip-planner"

export class App extends React.Component<IProps, IState> {
  defaultState = {
    page: Page.Greetings,
    selTags: { places: [], themes: [] },
    selPlaces: [],
  }
  constructor(props: IProps) {
    super(props)
    this.onGreetingsNext = this.onGreetingsNext.bind(this)
    this.onPlaceTagsSelected = this.onPlaceTagsSelected.bind(this)
    this.onPlaceTagsClosed = this.onPlaceTagsClosed.bind(this)
    this.onThemeTagsSelected = this.onThemeTagsSelected.bind(this)
    this.onThemeTagsClosed = this.onThemeTagsClosed.bind(this)
    this.onPlacesSelected = this.onPlacesSelected.bind(this)
    this.onPlacesClosed = this.onPlacesClosed.bind(this)
    this.onFinalClosed = this.onFinalClosed.bind(this)
    this.clearState = this.clearState.bind(this)
    this.state = {
      page: Page.Loading,
      selTags: { places: [], themes: [] },
      selPlaces: [],
    }
  }

  clearState() {
    this.setState(this.defaultState)
    localStorage.removeItem(STORAGE_NAME)
  }

  componentDidMount() {
    var data_str = localStorage.getItem(STORAGE_NAME)
    if (!data_str) {
      this.setState(this.defaultState)
      return
    }
    try {
      var data = JSON.parse(data_str)
      var restore = sessionStorage.getItem(STORAGE_NAME)
      const millisInHr = 1000 * 60 * 60
      const isExpired = !data.date || Date.now() - data.date > millisInHr * 5
      if (isExpired || (!restore && !window.confirm(i18n["restore_session"]))) {
        throw new Error()
      }
      this.setState(data.state)
    } catch (error) {
      this.clearState()
    }
  }

  componentDidUpdate() {
    if (this.state.page == Page.Greetings || this.state.page == Page.Loading) {
      return
    }
    localStorage.setItem(
      STORAGE_NAME,
      JSON.stringify({ date: Date.now(), state: this.state })
    )
    sessionStorage.setItem(STORAGE_NAME, "restore")
  }

  onGreetingsNext() {
    this.setState({ page: Page.PlaceTags })
    ym("reachGoal", "place-tags")
  }

  onPlaceTagsSelected(selTags: string[]) {
    this.setState({
      selTags: { places: selTags, themes: this.state.selTags.themes },
    })
  }

  onPlaceTagsClosed() {
    this.setState({
      page: Page.ThemeTags,
    })
    ym("reachGoal", "theme-tags")
  }

  onThemeTagsSelected(selTags: string[]) {
    this.setState({
      selTags: { places: this.state.selTags.places, themes: selTags },
    })
  }

  onThemeTagsClosed() {
    this.setState({
      page: Page.Places,
    })
  }

  onPlacesSelected(selPlaces: string[]) {
    this.setState({
      selPlaces: selPlaces,
    })
  }

  onPlacesClosed() {
    this.setState({ page: Page.Final })
  }

  onFinalClosed() {
    this.clearState()
  }

  render() {
    return (
      <Layout
        headerCb={() => {
          this.clearState()
        }}
      >
        {this.state.page == Page.Greetings && (
          <Greetings onExit={this.onGreetingsNext} />
        )}
        {this.state.page == Page.PlaceTags && (
          <TagsSelector
            tags={this.props.tags.places}
            selTags={this.state.selTags.places}
            onUpdate={this.onPlaceTagsSelected}
            onExit={this.onPlaceTagsClosed}
            header={i18n["select_place_tags"]}
          />
        )}
        {this.state.page == Page.ThemeTags && (
          <TagsSelector
            tags={this.props.tags.themes}
            selTags={this.state.selTags.themes}
            onUpdate={this.onThemeTagsSelected}
            onExit={this.onThemeTagsClosed}
            header={i18n["select_theme_tags"]}
          />
        )}
        {this.state.page == Page.Places && (
          <PlaceSelector
            selPlaces={this.state.selPlaces}
            selTags={this.state.selTags}
            places={this.props.places}
            onUpdate={this.onPlacesSelected}
            onExit={this.onPlacesClosed}
          />
        )}
        {this.state.page == Page.Final && <Final onExit={this.onFinalClosed} />}
      </Layout>
    )
  }
}
