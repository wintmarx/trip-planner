import React, { useEffect, useState } from "react";
import TagsSelector from "./tags-selector";
import Final from "./final";
import Greetings from "./greetings";
import Layout from "./layout";
import PlaceSelector from "./place-selector";
import i18n from "../assets/i18n/locale/ru.json";
import ym from "react-yandex-metrika";
import { Api, TripRequestPlace } from "../api";
import TabSelector, { Tab } from "./tab-selector";
import CircleLoader from "react-spinners/CircleLoader";
import EmailPage from "./email";
import SNServices, { SNSProfiles } from "./sns_services/sn_services";
import PrivacyPolicy from "./privacy_policy/privacy_policy";
import PrivacyPolicyPopup from "./privacy_policy_popup/privacy_policy_popup";
import ReactGA from "react-ga4";

enum Page {
  Greetings,
  SNServices,
  PlaceTags,
  ThemeTags,
  Places,
  Email,
  Final,
  Loading,
  PrivacyPolicy,
}

export type Tags = {
  places: string[];
  themes: string[];
};

export type PlaceData = {
  id: string;
  name: string;
  description: string;
  photo: string;
  ttv: number;
  tags: Tags;
  gmReviewsCnt: number;
  gmRating: number;
  taReviewsCnt: number;
  taRating: number;
  googleLink: string;
  twogisLink: string;
  yandexLink: string;
};

interface AppProps {
  places: PlaceData[];
  tags: Tags;
  debug?: boolean;
}

interface AppState {
  page: Page;
  selTags: Tags;
  selPlaces: string[];
  showLoading: boolean;
  apiError: boolean;
  isPolicyAccepted: boolean;
}

const STORAGE_NAME = "trip-planner";
const PRIVACY_STORAGE_NAME = `${STORAGE_NAME}-privacy`;

const defaultState: AppState = {
  page: Page.Greetings,
  selTags: { places: [], themes: [] },
  selPlaces: [],
  showLoading: false,
  apiError: false,
  isPolicyAccepted: false,
};

const api = new Api();
let previousPage: Page = defaultState.page;

let isInit = false;

export function App(props: AppProps) {
  const [curPage, setPage] = useState(Page.Loading);
  const [selTags, setSelTags] = useState(defaultState.selTags);
  const [selPlaces, setSelPlaces] = useState(defaultState.selPlaces);
  const [apiError, setApiError] = useState(defaultState.apiError);
  const [isPolicyAccepted, acceptPolicy] = useState(false);
  const [isShowLoading, enableLoading] = useState(false);

  function clearState() {
    setPage(defaultState.page);
    setSelTags(defaultState.selTags);
    setSelPlaces(defaultState.selPlaces);
    setApiError(defaultState.apiError);
    enableLoading(defaultState.showLoading);
    acceptPolicy(isPolicyAccepted);

    localStorage.removeItem(STORAGE_NAME);

    ym("reachGoal", "greetings");
    ReactGA.send({ hitType: "pageview", title: Page[Page.Greetings] });
    ReactGA.event({
      category: "state",
      action: "clear_state",
    });
  }

  useEffect(() => {
    if (isInit) {
      return;
    }
    isInit = true;

    ReactGA.initialize(process.env.GATSBY_GA_ID || "");
    const dataStr = localStorage.getItem(STORAGE_NAME);
    const wasPolicyAccepted = localStorage.getItem(PRIVACY_STORAGE_NAME);
    if (!dataStr) {
      acceptPolicy(!!wasPolicyAccepted);
      setPage(Page.Greetings);

      ym("reachGoal", "greetings");
      ReactGA.send({ hitType: "pageview", title: Page[Page.Greetings] });
      return;
    }
    try {
      const data = JSON.parse(dataStr);
      const restore = sessionStorage.getItem(STORAGE_NAME);
      const millisInHr = 1000 * 60 * 60;
      const isExpired = !data.date || Date.now() - data.date > millisInHr * 5;
      if (isExpired) {
        ym("reachGoal", "expired_state");
        ReactGA.send({
          hitType: "event",
          eventCategory: "state",
          eventAction: "expired_state",
          title: Page[curPage],
        });
      }

      if (isExpired || (!restore && !window.confirm(i18n["restore_session"]))) {
        throw new Error();
      }

      setApiError(defaultState.apiError);
      acceptPolicy(!!wasPolicyAccepted);
      setPage(data.page);
      setSelPlaces(data.selPlaces);
      setSelTags(data.selTags);

      ym("reachGoal", "restore");
      ReactGA.send({
        hitType: "event",
        eventCategory: "state",
        eventAction: "restore_state",
        title: Page[curPage],
      });
    } catch (error) {
      clearState();
    }
  }, []);

  useEffect(() => {
    if (isPolicyAccepted) {
      localStorage.setItem(PRIVACY_STORAGE_NAME, "1");
    }
    if (curPage == Page.Greetings || curPage == Page.PrivacyPolicy || curPage == Page.Loading) {
      return;
    }
    localStorage.setItem(
      STORAGE_NAME,
      JSON.stringify({
        date: Date.now(),
        page: curPage,
        selTags: selTags,
        selPlaces: selPlaces,
      })
    );
    sessionStorage.setItem(STORAGE_NAME, "restore");
    ReactGA.send({
      hitType: "event",
      eventCategory: "state",
      eventAction: "save_state",
      title: Page[curPage],
    });
  }, [isPolicyAccepted, curPage, selTags, selPlaces]);

  function onGreetingsNext() {
    setPage(Page.SNServices);
    ReactGA.send({ hitType: "pageview", title: Page[Page.SNServices] });
  }

  function onPlaceTagsSelected(newPlaceTags: string[]) {
    const updatedTags: Tags = { places: newPlaceTags, themes: selTags.themes };
    setSelTags(updatedTags);
    ReactGA.event({
      category: "tags",
      action: "select_place_tags",
      label: updatedTags.toString(),
    });
  }

  function onPlaceTagsClosed() {
    setPage(Page.ThemeTags);
    ReactGA.send({ hitType: "pageview", title: Page[Page.ThemeTags] });
  }

  function onThemeTagsSelected(newThemeTags: string[]) {
    const updatedTags: Tags = { places: selTags.places, themes: newThemeTags };
    setSelTags(updatedTags);
    ReactGA.event({
      category: "tags",
      action: "select_theme_tags",
      label: selTags.toString(),
    });
  }

  function onThemeTagsClosed() {
    setPage(Page.Places);
    ReactGA.send({ hitType: "pageview", title: Page[Page.Places] });
  }

  function onPlacesSelected(newSelPlaces: string[]) {
    setSelPlaces(newSelPlaces);
    ym("reachGoal", "places", { selPlaces: newSelPlaces });
    ReactGA.event({
      category: "places",
      action: "select_places",
      label: newSelPlaces.toString(),
    });
  }

  function onPlacesClosed() {
    setPage(Page.Email);
    ReactGA.send({ hitType: "pageview", title: Page[Page.Email] });
  }

  function onEnterValidEmail(email: string) {
    ym("reachGoal", "valid-email");
    ReactGA.event({
      category: "email",
      action: "valid_email",
    });
  }

  function onSend(email: string) {
    enableLoading(true);
    setApiError(false);
    const requestPlaces = props.places
      .filter((place) => selPlaces.includes(place.id))
      .map(
        (place) =>
          ({
            desc: place.description,
            title: place.name,
            ttv: place.ttv,
            googleLink: place.googleLink,
            twogisLink: place.twogisLink,
            yandexLink: place.yandexLink,
            photo: place.photo.split("/").pop(),
          } as TripRequestPlace)
      );

    api
      .requestTrip({ email: email, places: requestPlaces })
      .then((res) => {
        setPage(Page.Final);
      })
      .catch((err) => {
        setApiError(true);
      })
      .finally(() => {
        enableLoading(false);
      });

    ym("reachGoal", "route", {
      selTags: selTags,
      places: selPlaces,
    });
    ReactGA.event(
      {
        category: "api",
        action: "request_trip",
      },
      {
        selected_places: selPlaces.toString(),
        selected_theme_tags: selTags.themes.toString(),
        selected_place_tags: selTags.places.toString(),
      }
    );
  }

  function onFinalClosed() {
    clearState();
  }

  function onEmailMiss() {
    setPage(Page.Email);
    ReactGA.send({ hitType: "pageview", title: Page[Page.Email] });
    ReactGA.event({
      category: "email",
      action: "miss_email",
    });
  }

  function onSNSExit(profiles: SNSProfiles) {
    setPage(Page.PlaceTags);
    ReactGA.send({ hitType: "pageview", title: Page[Page.PlaceTags] });
    ReactGA.event("sns", {
      vk: profiles.vk,
      fb: profiles.fb,
      inst: profiles.inst,
    });
  }

  function onSNSSkip() {
    setPage(Page.PlaceTags);
    ReactGA.send({ hitType: "pageview", title: Page[Page.PlaceTags] });
    ReactGA.event({
      category: "sns",
      action: "sns_skip",
    });
  }

  function onPrivacyPolicyExit() {
    setPage(previousPage);
    acceptPolicy(true);
    ReactGA.send({ hitType: "pageview", title: Page[previousPage] });
    ReactGA.event({
      category: "privacy_policy",
      action: "accept_privacy_policy",
    });
  }

  function onPrivacyPolicyAccept() {
    acceptPolicy(true);
    ReactGA.event({
      category: "privacy_policy",
      action: "accept_privacy_policy",
    });
  }

  function onPrivacyPolicyMore() {
    previousPage = curPage;
    setPage(Page.PrivacyPolicy);
    ReactGA.send({ hitType: "pageview", title: Page[Page.PrivacyPolicy] });
  }

  function onTabChanged(page: Page) {
    setPage(page);
    ReactGA.send({ hitType: "pageview", title: Page[page] });
    ReactGA.event({
      category: "tabs",
      action: "change_tab",
      label: Page[page],
    });
  }

  function isTabsVisible() {
    return curPage == Page.PlaceTags || curPage == Page.ThemeTags || curPage == Page.Places;
  }

  function renderTabs() {
    const tabs: Tab[] = [
      { title: i18n["objects"], value: Page.PlaceTags },
      { title: i18n["themes"], value: Page.ThemeTags },
      { title: i18n["route"], value: Page.Places },
    ];
    return <TabSelector tabs={tabs} value={curPage} onChange={(p: number) => onTabChanged(p as Page)} />;
  }

  function renderLoading() {
    return (
      <>
        {isShowLoading && (
          <div className="loading">
            <div className="loading-bg" />
            <CircleLoader
              color={"#5cc6b3"}
              cssOverride={{
                display: "block",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              loading={true}
              size={80}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <Layout
      headerCb={() => {
        clearState();
      }}
    >
      {curPage == Page.Greetings && <Greetings onExit={onGreetingsNext} />}

      {curPage == Page.SNServices && <SNServices onExit={onSNSExit} onSkip={onSNSSkip} />}

      {curPage == Page.PrivacyPolicy && <PrivacyPolicy onExit={onPrivacyPolicyExit} />}

      {isTabsVisible() && renderTabs()}
      {curPage == Page.PlaceTags && (
        <TagsSelector
          tags={props.tags.places}
          selTags={selTags.places}
          onUpdate={onPlaceTagsSelected}
          onExit={onPlaceTagsClosed}
          header={i18n["select_place_tags"]}
        />
      )}
      {curPage == Page.ThemeTags && (
        <TagsSelector
          tags={props.tags.themes}
          selTags={selTags.themes}
          onUpdate={onThemeTagsSelected}
          onExit={onThemeTagsClosed}
          header={i18n["select_theme_tags"]}
        />
      )}
      {curPage == Page.Places && (
        <PlaceSelector
          debug={props.debug !== undefined && props.debug}
          selPlaces={selPlaces}
          selTags={selTags}
          places={props.places}
          onUpdate={onPlacesSelected}
          onExit={onPlacesClosed}
        />
      )}
      {curPage == Page.Email && <EmailPage onEnterValidEmail={onEnterValidEmail} onSend={onSend} error={apiError} />}
      {curPage == Page.Final && <Final onMiss={onEmailMiss} onExit={onFinalClosed} />}
      {!isPolicyAccepted && curPage != Page.PrivacyPolicy && (
        <PrivacyPolicyPopup onExit={onPrivacyPolicyAccept} onInfo={onPrivacyPolicyMore} />
      )}

      {renderLoading()}
    </Layout>
  );
}
