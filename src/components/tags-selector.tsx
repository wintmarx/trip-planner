import React, { useEffect, useState } from "react";
import i18n from "../assets/i18n/locale/ru.json";
import "../css/tags-selector.css";

type ToggleButtonData = {
  name: string;
  checked: boolean;
  label: string;
};

interface TagsSelectorProps {
  onUpdate?: (selTags: string[]) => void;
  onExit?: () => void;
  header: string;
  tags: string[];
  selTags: string[];
}

function mapTagsOnBtns(tags: string[], selTags: string[]) {
  return tags
    .map(
      (tag) =>
        ({
          name: tag,
          checked: selTags.includes(tag),
          label: i18n[tag as keyof typeof i18n],
        } as ToggleButtonData)
    )
    .sort((a, b) => a.label.length - b.label.length);
}

export default function TagsSelector(props: TagsSelectorProps) {
  useEffect(() => {
    document?.querySelector("body")?.scrollTo(0, 0);
  }, []);

  const [btnData, setBtnData] = useState(mapTagsOnBtns(props.tags, props.selTags));

  function renderBtns() {
    return btnData.map((btn, index) => (
      <button
        className={`toggle-btn ${btn.checked ? "checked-btn" : "reg-btn"}`}
        key={index}
        type="button"
        onClick={onToggleBtnClick.bind(null, index)}
      >
        <div className={`toggle-btn-label ${btn.checked ? "checked-label" : ""}`}>{btn.label}</div>
      </button>
    ));
  }

  function onToggleBtnClick(index: number) {
    const updatedBtns = btnData.map((btn, btnIdx) => {
      if (btnIdx === index) {
        return { ...btn, checked: !btn.checked };
      }
      return btn;
    });

    setBtnData(updatedBtns);
    props.onUpdate?.(updatedBtns.filter((cb) => cb.checked).map((cb) => cb.name));
  }

  return (
    // <div className="outter-container">
    <div className="page-container">
      <h3 className="tag-header">{props.header}</h3>
      <div className="tag-container">{renderBtns()}</div>
      <button className="tag-btn" onClick={props.onExit}>
        <span>{i18n["next_page"]} →</span>
      </button>
    </div>
    //   </div>
  );
}
