import React from "react"
import TagsSelector from "./tags-selector"
import Final from "./final"
import Greetings from "./greetings"
import Layout from "./layout"
import PlaceSelector from "./place-selector"
import i18n from "../i18n/ru.json"

enum Page {
  Greetings,
  PlaceTags,
  ThemeTags,
  Places,
  Final,
}

export type Tags = {
  places: string[]
  themes: string[]
}

export type PlaceData = {
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
}

export class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.onGreetingsNext = this.onGreetingsNext.bind(this)
    this.onPlaceTagsSelected = this.onPlaceTagsSelected.bind(this)
    this.onThemeTagsSelected = this.onThemeTagsSelected.bind(this)
    this.onPicturesClosed = this.onPicturesClosed.bind(this)
    this.onFinalClosed = this.onFinalClosed.bind(this)
    this.state = { page: Page.Greetings, selTags: { places: [], themes: [] } }
  }

  onGreetingsNext() {
    this.setState({ page: Page.PlaceTags })
  }

  onPlaceTagsSelected(selTags: string[]) {
    this.setState({
      page: Page.ThemeTags,
      selTags: { places: selTags, themes: this.state.selTags.themes },
    })
  }

  onThemeTagsSelected(selTags: string[]) {
    this.setState({
      page: Page.Places,
      selTags: { places: this.state.selTags.places, themes: selTags },
    })
  }

  onPicturesClosed() {
    this.setState({ page: Page.Final })
  }

  onFinalClosed() {
    this.setState({ page: Page.Greetings })
  }

  render() {
    return (
      <Layout
        headerCb={() => {
          this.setState({ page: Page.Greetings })
        }}
      >
        {this.state.page == Page.Greetings && (
          <Greetings onExitCb={this.onGreetingsNext} />
        )}
        {this.state.page == Page.PlaceTags && (
          <TagsSelector
            tags={this.props.tags.places}
            onExitCb={this.onPlaceTagsSelected}
            header={i18n["select_place_tags"]}
          />
        )}
        {this.state.page == Page.ThemeTags && (
          <TagsSelector
            tags={this.props.tags.themes}
            onExitCb={this.onThemeTagsSelected}
            header={i18n["select_theme_tags"]}
          />
        )}
        {this.state.page == Page.Places && (
          <PlaceSelector
            selTags={this.state.selTags}
            places={this.props.places}
            onExitCb={this.onPicturesClosed}
          />
        )}
        {this.state.page == Page.Final && (
          <Final onExitCb={this.onFinalClosed} />
        )}
      </Layout>
    )
  }
}
