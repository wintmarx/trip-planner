import React, { useEffect, useState } from "react";
import ym from "react-yandex-metrika";
import "../css/place-selector.css";
import i18n from "../assets/i18n/locale/ru.json";
import { PlaceData, Tags } from "./app";
import PlaceCard from "./place-card";
import Timeline from "./timeline";

type PlaceState = {
  checked: boolean;
  label: string;
  score: number;
  placeData: PlaceData;
};

type PlaceSelectorProps = {
  onUpdate?: (selPlaces: string[]) => void;
  onExit?: () => void;
  debug?: boolean;
  selTags: Tags;
  places: PlaceData[];
  selPlaces: string[];
};

function getPlaceScore(place: PlaceData, selTags: Tags) {
  const pMatch = place.tags.places.filter((tag) => selTags.places.includes(tag)).length;
  const tMatch = place.tags.themes.filter((tag) => selTags.themes.includes(tag)).length;
  return (
    3 * pMatch +
    2 * tMatch +
    (place.gmRating + place.taRating) / 10 +
    Math.log10(place.gmReviewsCnt + place.taReviewsCnt + 1) / 10
  );
}

export default function PlaceSelector(props: PlaceSelectorProps) {
  function loadCards() {
    type PlacesRating = { [id: string]: number };
    const placesRating: PlacesRating = Object.fromEntries(
      props.places.map((place) => {
        return [place.name, getPlaceScore(place, props.selTags)];
      })
    );

    const sorted = props.places.sort((a: PlaceData, b: PlaceData) => {
      return placesRating[b.name] - placesRating[a.name];
    });

    return sorted.map(
      (place) =>
        ({
          checked: props.selPlaces.includes(place.id),
          label: place.name,
          score: placesRating[place.name],
          placeData: place,
        } as PlaceState)
    );
  }

  const [cards, setCards] = useState(loadCards());
  const [infoIndex, setInfoIndex] = useState(-1);

  useEffect(() => {
    document?.querySelector("body")?.scrollTo(0, 0);
  }, []);

  function onCardClick(index: number, checked: boolean, e: any) {
    const updatedCards = cards.map((card, cardIdx) => {
      if (cardIdx == index) {
        return { ...card, checked: checked };
      }
      return card;
    });

    setCards(updatedCards);
    props.onUpdate?.(updatedCards.filter((card) => card.checked).map((card) => card.placeData.id));
  }

  function onReset() {
    setCards(
      cards.map((card) => {
        return { ...card, checked: false };
      })
    );

    props.onUpdate?.([]);
  }

  function onClickInfo(index: number, e: any) {
    e.stopPropagation();
    if (index == infoIndex) {
      index = -1;
    } else {
      ym("reachGoal", "place-info");
    }
    setInfoIndex(index);
  }

  function renderCards() {
    return cards.map((card, index) => (
      <PlaceCard
        key={index}
        checked={card.checked}
        debug={props.debug}
        label={card.label}
        score={card.score}
        placeData={card.placeData}
        showInfo={index == infoIndex}
        onInfoClick={onClickInfo.bind(null, index)}
        onClick={onCardClick.bind(null, index)}
      />
    ));
  }

  function getConsumedTime() {
    let time = 0;
    cards.filter((card) => card.checked).forEach((it) => (time += it.placeData.ttv));
    return time;
  }

  function isTimelineHidden() {
    return getConsumedTime() == 0;
  }

  return (
    <>
      <h3 className="places-header">{i18n["select_places"]}</h3>
      <p
        className="places-desc"
        //   style={{
        //     opacity: `${
        //       isTimelineHidden() ? "inherit" : "0"
        //     }`,
        //     transform: `scaleY(${
        //         isTimelineHidden() ? "1" : "0"
        //       })`
        //   }}
      >
        {i18n["select_places_help"]}
      </p>
      <div
        className="cards-container"
        style={{
          marginBottom: `${isTimelineHidden() ? "inherit" : "max(11vh, 140px)"}`,
        }}
      >
        {renderCards()}
      </div>
      <Timeline
        hidden={isTimelineHidden()}
        time={getConsumedTime()}
        minDayTime={60}
        maxDayTime={720}
        defaultDayTime={480}
        onExit={props.onExit}
        onReset={onReset}
      />
    </>
  );
}
