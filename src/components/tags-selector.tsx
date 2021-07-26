import React from "react"
import i18n from "../i18n/ru.json"
import "../css/tags-selector.css"

type ToggleButtonData = {
  name: string
  checked: boolean
  label: string
}

interface IProps {
  onUpdate?: (selTags: string[]) => void
  onExit?: () => void
  header: string
  tags: string[]
  selTags: string[]
}

interface IState {
  btnData: ToggleButtonData[]
}

export default class TagsSelector extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      btnData: this.mapTagsOnBtns(this.props.tags, this.props.selTags),
    }
  }

  componentDidMount() {
    document?.querySelector("body")?.scrollTo(0, 0)
  }

  mapTagsOnBtns(tags: string[], selTags: string[]) {
    return tags
      .map(
        tag =>
          ({
            name: tag,
            checked: selTags.includes(tag),
            label: i18n[tag as keyof typeof i18n],
          } as ToggleButtonData)
      )
      .sort((a, b) => a.label.length - b.label.length)
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
    if (this.props.onUpdate !== undefined) {
      this.props.onUpdate(btns.filter(cb => cb.checked).map(cb => cb.name))
    }
  }

  render() {
    return (
      // <div className="outter-container">
      <div className="page-container">
        <h3 className="tag-header">{this.props.header}</h3>
        <div className="tag-container">{this.renderBtns.call(this)}</div>
        <button className="tag-btn" onClick={this.props.onExit}>
          <span>{i18n["next_page"]} →</span>
        </button>
      </div>
      //   </div>
    )
  }
}
