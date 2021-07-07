import React from "react"
import "../css/tab-selector.css"

export type Tab = {
  title: string
  value: number
}

interface IProps {
  tabs: Tab[]
  value: number
  onChange?: (value: number) => void
}

export default class TabSelector extends React.Component<IProps> {
  tabRefs: React.RefObject<HTMLDivElement>[]
  constructor(props: IProps) {
    super(props)
    this.tabRefs = props.tabs.map(() => React.createRef())
  }

  renderTabs() {
    return this.props.tabs.map((tab: Tab, index: number) => (
      <React.Fragment key={index}>
        <div
          className="tab"
          style={{
            transition: "border-color 0.1s linear",
            borderBottom: `3px solid rgba(92,198,179, ${
              tab.value === this.props.value ? 1 : 0
            })`,
          }}
          onClick={() => {
            if (this.props.onChange !== undefined) {
              this.props.onChange(tab.value)
            }
          }}
        >
          {tab.title}
        </div>
      </React.Fragment>
    ))
  }

  render() {
    const tabIdx = this.props.tabs.findIndex(el => el.value == this.props.value)
    return (
      <>
        <div className="tab-container">{this.renderTabs()}</div>
      </>
    )
  }
}
