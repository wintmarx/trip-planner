import React from "react";
import "../css/tab-selector.css";

export type Tab = {
  title: string;
  value: number;
};

interface TabSelectorProps {
  tabs: Tab[];
  value: number;
  onChange?: (value: number) => void;
}

export default function TabSelector(props: TabSelectorProps) {
  function renderTabs() {
    return props.tabs.map((tab: Tab, index: number) => (
      <React.Fragment key={index}>
        <div
          className="tab"
          style={{
            transition: "border-color 0.1s linear",
            borderBottom: `3px solid rgba(92,198,179, ${tab.value === props.value ? 1 : 0})`,
          }}
          onClick={() => {
            props.onChange?.(tab.value);
          }}
        >
          {tab.title}
        </div>
      </React.Fragment>
    ));
  }

  return <div className="tab-container">{renderTabs()}</div>;
}
