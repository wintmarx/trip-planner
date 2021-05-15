import React from "react"
import i18n from "../i18n/ru.json"
import { ThemeButton } from "./theme-button"
import "../css/tags-selector.css"

type ToggleButtonData = {
  name: string
  checked: boolean
  label: string
}

interface IProps {
  onExitCb: (selTags: string[]) => void
  header: string
  tags: string[]
}

interface IState {
  btnData: ToggleButtonData[]
}

export default class TagsSelector extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      btnData: this.mapTagsOnBtns(this.props.tags),
    }
  }

  mapTagsOnBtns(tags: string[]) {
    return tags.map(
      tag =>
        ({
          name: tag,
          checked: false,
          label: i18n[tag as keyof typeof i18n],
        } as ToggleButtonData)
    )
  }

  renderBtns() {
    return this.state.btnData.map((btn, index) => (
      <button
        className={`toggle-btn ${btn.checked ? "checked-btn" : "reg-btn"}`}
        key={index}
        type="button"
        onClick={this.onToggleBtnClick.bind(this, index)}
      >
        <div
          className={`toggle-btn-label ${btn.checked ? "checked-label" : ""}`}
        >
          {btn.label}
        </div>
      </button>
    ))
  }

  onToggleBtnClick(index: number) {
    const btns = this.state.btnData
    btns[index].checked = !btns[index].checked
    this.setState({ btnData: btns })
  }

  onExit() {
    this.props.onExitCb(
      this.state.btnData.filter(cb => cb.checked).map(cb => cb.name)
    )
  }

  render() {
    return (
      <>
        <h3 className="tag-header">{i18n["select_place_tags"]}</h3>
        <div className="tag-container">{this.renderBtns.call(this)}</div>
        <ThemeButton className="tag-btn" onClick={this.onExit.bind(this)}>
          {i18n["next_page"]} →
        </ThemeButton>
      </>
    )
  }
}
