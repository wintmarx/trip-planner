import React from "react"
import TagsSelector from "./tags-selector"
import Final from "./final"
import Greetings from "./greetings"
import Layout from "./layout"
import PlaceSelector from "./place-selector"
import i18n from "../i18n/ru.json"
import ym from "react-yandex-metrika"
import { Api, TripRequestPlace } from "../api"
import TabSelector, { Tab } from "./tab-selector"
import CircleLoader from "react-spinners/CircleLoader"

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
  googleLink: string
  twogisLink: string
  yandexLink: string
}

interface IProps {
  places: PlaceData[]
  tags: Tags
  debug?: boolean
}

interface IState {
  page: Page
  selTags: Tags
  selPlaces: string[]
  showLoading: boolean
  apiError: boolean
}

const STORAGE_NAME = "trip-planner"

export class App extends React.Component<IProps, IState> {
  defaultState = {
    page: Page.Greetings,
    selTags: { places: [], themes: [] },
    selPlaces: [],
    showLoading: false,
    apiError: false,
  }
  api = new Api()
  constructor(props: IProps) {
    super(props)
    this.onGreetingsNext = this.onGreetingsNext.bind(this)
    this.onPlaceTagsSelected = this.onPlaceTagsSelected.bind(this)
    this.onPlaceTagsClosed = this.onPlaceTagsClosed.bind(this)
    this.onThemeTagsSelected = this.onThemeTagsSelected.bind(this)
    this.onThemeTagsClosed = this.onThemeTagsClosed.bind(this)
    this.onPlacesSelected = this.onPlacesSelected.bind(this)
    this.onPlacesClosed = this.onPlacesClosed.bind(this)
    this.onEnterValidEmail = this.onEnterValidEmail.bind(this)
    this.onFinalClosed = this.onFinalClosed.bind(this)
    this.clearState = this.clearState.bind(this)
    this.isTabsVisible = this.isTabsVisible.bind(this)
    this.renderTabs = this.renderTabs.bind(this)
    this.renderLoading = this.renderLoading.bind(this)
    this.state = {
      page: Page.Loading,
      selTags: this.defaultState.selTags,
      selPlaces: this.defaultState.selPlaces,
      showLoading: this.defaultState.showLoading,
      apiError: this.defaultState.apiError,
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
      if (isExpired) {
        ym("reachGoal", "expired-state")
      }
      if (isExpired || (!restore && !window.confirm(i18n["restore_session"]))) {
        throw new Error()
      }
      data.state.apiError = this.defaultState.apiError
      this.setState(data.state)
      ym("reachGoal", "restore")
    } catch (error) {
      this.clearState()
      ym("reachGoal", "no-restore")
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
    ym("reachGoal", "greetings")
  }

  onPlaceTagsSelected(selTags: string[]) {
    this.setState({
      selTags: { places: selTags, themes: this.state.selTags.themes },
    })
  }

  onPlaceTagsClosed() {
    ym("reachGoal", "place-tags", { placeTags: this.state.selTags.places })
    this.setState({
      page: Page.ThemeTags,
    })
  }

  onThemeTagsSelected(selTags: string[]) {
    this.setState({
      selTags: { places: this.state.selTags.places, themes: selTags },
    })
  }

  onThemeTagsClosed() {
    ym("reachGoal", "theme-tags", { themeTags: this.state.selTags.themes })
    this.setState({
      page: Page.Places,
    })
  }

  onPlacesSelected(selPlaces: string[]) {
    ym("reachGoal", "places", { selPlaces: this.state.selPlaces })
    this.setState({
      selPlaces: selPlaces,
    })
  }

  onPlacesClosed() {
    this.setState({ page: Page.Final })
  }

  onEnterValidEmail(email: string) {
    ym("reachGoal", "valid-email")
  }

  onFinalClosed(email: string) {
    ym("reachGoal", "route", {
      email: email,
      selTags: this.state.selTags,
      places: this.state.selPlaces,
    })
    this.setState({ showLoading: true })
    const requestPlaces = this.props.places
      .filter(place => this.state.selPlaces.includes(place.id))
      .map(
        place =>
          ({
            desc: place.description,
            title: place.name,
            ttv: place.ttv,
            googleLink: place.googleLink,
            twogisLink: place.twogisLink,
            yandexLink: place.yandexLink,
            photo: place.photo.split("/").pop(),
          } as TripRequestPlace)
      )

    this.api
      .requestTrip({ email: email, places: requestPlaces })
      .then(res => {
        this.clearState()
      })
      .catch(err => {
        this.setState({ apiError: true })
      })
      .finally(() => {
        this.setState({ showLoading: false })
      })
  }

  isTabsVisible() {
    return (
      this.state.page == Page.PlaceTags ||
      this.state.page == Page.ThemeTags ||
      this.state.page == Page.Places
    )
  }

  renderTabs() {
    const tabs: Tab[] = [
      { title: i18n["objects"], value: Page.PlaceTags },
      { title: i18n["themes"], value: Page.ThemeTags },
      { title: i18n["route"], value: Page.Places },
    ]
    return (
      <TabSelector
        tabs={tabs}
        value={this.state.page}
        onChange={(p: number) => this.setState({ page: p as Page })}
      />
    )
  }

  renderLoading() {
    return (
      <>
        {this.state.showLoading && (
          <div className="loading">
            <div className="loading-bg" />
            <CircleLoader
              color={"#5cc6b3"}
              css={`
                display: "block";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              `}
              loading={true}
              size={80}
            />
          </div>
        )}
      </>
    )
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

        {this.isTabsVisible() && this.renderTabs()}
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
            debug={this.props.debug !== undefined && this.props.debug}
            selPlaces={this.state.selPlaces}
            selTags={this.state.selTags}
            places={this.props.places}
            onUpdate={this.onPlacesSelected}
            onExit={this.onPlacesClosed}
          />
        )}

        {this.state.page == Page.Final && (
          <Final
            onEnterValidEmail={this.onEnterValidEmail}
            onExit={this.onFinalClosed}
            error={this.state.apiError}
          />
        )}

        {this.renderLoading()}
      </Layout>
    )
  }
}
