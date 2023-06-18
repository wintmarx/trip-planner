import React from "react";
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
import Email from "./email";
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

interface IProps {
  places: PlaceData[];
  tags: Tags;
  debug?: boolean;
}

interface IState {
  page: Page;
  selTags: Tags;
  selPlaces: string[];
  showLoading: boolean;
  apiError: boolean;
  isPolicyAccepted: boolean;
}

const STORAGE_NAME = "trip-planner";
const PRIVACY_STORAGE_NAME = `${STORAGE_NAME}-privacy`;

export class App extends React.Component<IProps, IState> {
  defaultState = {
    page: Page.Greetings,
    selTags: { places: [], themes: [] },
    selPlaces: [],
    showLoading: false,
    apiError: false,
    isPolicyAccepted: false,
  };
  api = new Api();
  previousPage: Page = this.defaultState.page;
  constructor(props: IProps) {
    super(props);
    this.onGreetingsNext = this.onGreetingsNext.bind(this);
    this.onPlaceTagsSelected = this.onPlaceTagsSelected.bind(this);
    this.onPlaceTagsClosed = this.onPlaceTagsClosed.bind(this);
    this.onThemeTagsSelected = this.onThemeTagsSelected.bind(this);
    this.onThemeTagsClosed = this.onThemeTagsClosed.bind(this);
    this.onPlacesSelected = this.onPlacesSelected.bind(this);
    this.onPlacesClosed = this.onPlacesClosed.bind(this);
    this.onEnterValidEmail = this.onEnterValidEmail.bind(this);
    this.onSend = this.onSend.bind(this);
    this.clearState = this.clearState.bind(this);
    this.isTabsVisible = this.isTabsVisible.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
    this.onFinalClosed = this.onFinalClosed.bind(this);
    this.onEmailMiss = this.onEmailMiss.bind(this);
    this.onSNSExit = this.onSNSExit.bind(this);
    this.onSNSSkip = this.onSNSSkip.bind(this);
    this.onPrivacyPolicyExit = this.onPrivacyPolicyExit.bind(this);
    this.onPrivacyPolicyAccept = this.onPrivacyPolicyAccept.bind(this);
    this.onPrivacyPolicyMore = this.onPrivacyPolicyMore.bind(this);
    this.onTabChanged = this.onTabChanged.bind(this);
    this.state = {
      page: Page.Loading,
      selTags: this.defaultState.selTags,
      selPlaces: this.defaultState.selPlaces,
      showLoading: this.defaultState.showLoading,
      apiError: this.defaultState.apiError,
      isPolicyAccepted: false,
    };
    ReactGA.initialize(process.env.GATSBY_GA_ID || "");
  }

  clearState() {
    const state = this.defaultState;
    state.isPolicyAccepted = this.state.isPolicyAccepted;
    this.setState(state);
    localStorage.removeItem(STORAGE_NAME);
    ym("reachGoal", "greetings");
    ReactGA.send({ hitType: "pageview", title: Page[Page.Greetings] });
    ReactGA.event({
      category: "state",
      action: "clear_state",
    });
  }

  componentDidMount() {
    const data_str = localStorage.getItem(STORAGE_NAME);
    const isPolicyAccepted = localStorage.getItem(PRIVACY_STORAGE_NAME);
    if (!data_str) {
      const state = this.defaultState;
      state.isPolicyAccepted = !!isPolicyAccepted;
      this.setState(state);
      ym("reachGoal", "greetings");
      ReactGA.send({ hitType: "pageview", title: Page[Page.Greetings] });
      return;
    }
    try {
      const data = JSON.parse(data_str);
      const restore = sessionStorage.getItem(STORAGE_NAME);
      const millisInHr = 1000 * 60 * 60;
      const isExpired = !data.date || Date.now() - data.date > millisInHr * 5;
      if (isExpired) {
        ym("reachGoal", "expired_state");
        ReactGA.send({
          hitType: "event",
          eventCategory: "state",
          eventAction: "expired_state",
          title: Page[this.state.page],
        });
      }
      if (isExpired || (!restore && !window.confirm(i18n["restore_session"]))) {
        throw new Error();
      }
      data.state.apiError = this.defaultState.apiError;
      data.state.isPolicyAccepted = !!isPolicyAccepted;
      this.setState(data.state);
      ym("reachGoal", "restore");
      ReactGA.send({
        hitType: "event",
        eventCategory: "state",
        eventAction: "restore_state",
        title: Page[this.state.page],
      });
    } catch (error) {
      this.clearState();
    }
  }

  componentDidUpdate() {
    if (this.state.isPolicyAccepted) {
      localStorage.setItem(PRIVACY_STORAGE_NAME, "1");
    }
    if (this.state.page == Page.Greetings || this.state.page == Page.PrivacyPolicy || this.state.page == Page.Loading) {
      return;
    }
    localStorage.setItem(STORAGE_NAME, JSON.stringify({ date: Date.now(), state: this.state }));
    sessionStorage.setItem(STORAGE_NAME, "restore");
    ReactGA.send({
      hitType: "event",
      eventCategory: "state",
      eventAction: "save_state",
      title: Page[this.state.page],
    });
  }

  onGreetingsNext() {
    this.setState({ page: Page.SNServices });
    ReactGA.send({ hitType: "pageview", title: Page[Page.SNServices] });
  }

  onPlaceTagsSelected(selTags: string[]) {
    this.setState({
      selTags: { places: selTags, themes: this.state.selTags.themes },
    });
    ReactGA.event({
      category: "tags",
      action: "select_place_tags",
      label: selTags.toString(),
    });
  }

  onPlaceTagsClosed() {
    ReactGA.send({ hitType: "pageview", title: Page[Page.ThemeTags] });
    this.setState({ page: Page.ThemeTags });
  }

  onThemeTagsSelected(selTags: string[]) {
    this.setState({
      selTags: { places: this.state.selTags.places, themes: selTags },
    });
    ReactGA.event({
      category: "tags",
      action: "select_theme_tags",
      label: selTags.toString(),
    });
  }

  onThemeTagsClosed() {
    this.setState({ page: Page.Places });
    ReactGA.send({ hitType: "pageview", title: Page[Page.Places] });
  }

  onPlacesSelected(selPlaces: string[]) {
    this.setState({ selPlaces: selPlaces });
    ym("reachGoal", "places", { selPlaces: selPlaces });
    ReactGA.event({
      category: "places",
      action: "select_places",
      label: selPlaces.toString(),
    });
  }

  onPlacesClosed() {
    this.setState({ page: Page.Email });
    ReactGA.send({ hitType: "pageview", title: Page[Page.Email] });
  }

  onEnterValidEmail(email: string) {
    ym("reachGoal", "valid-email");
    ReactGA.event({
      category: "email",
      action: "valid_email",
      label: email,
    });
  }

  onSend(email: string) {
    ym("reachGoal", "route", {
      email: email,
      selTags: this.state.selTags,
      places: this.state.selPlaces,
    });
    ReactGA.event(
      {
        category: "api",
        action: "request_trip",
      },
      {
        email: email,
        selected_places: this.state.selPlaces.toString(),
        selected_theme_tags: this.state.selTags.themes.toString(),
        selected_place_tags: this.state.selTags.places.toString(),
      }
    );
    this.setState({ showLoading: true });
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
      );

    this.api
      .requestTrip({ email: email, places: requestPlaces })
      .then(res => {
        this.setState({ page: Page.Final, apiError: false });
      })
      .catch(err => {
        this.setState({ apiError: true });
      })
      .finally(() => {
        this.setState({ showLoading: false });
      });
  }

  onFinalClosed() {
    this.clearState();
  }

  onEmailMiss() {
    this.setState({ page: Page.Email });
    ReactGA.send({ hitType: "pageview", title: Page[Page.Email] });
    ReactGA.event({
      category: "email",
      action: "miss_email",
    });
  }

  onSNSExit(profiles: SNSProfiles) {
    this.setState({ page: Page.PlaceTags });
    ReactGA.send({ hitType: "pageview", title: Page[Page.PlaceTags] });
    ReactGA.event("sns", {
      vk: profiles.vk,
      fb: profiles.fb,
      inst: profiles.inst,
    });
  }

  onSNSSkip() {
    this.setState({ page: Page.PlaceTags });
    ReactGA.send({ hitType: "pageview", title: Page[Page.PlaceTags] });
    ReactGA.event({
      category: "sns",
      action: "sns_skip",
    });
  }

  onPrivacyPolicyExit() {
    this.setState({ page: this.previousPage, isPolicyAccepted: true });
    ReactGA.send({ hitType: "pageview", title: Page[this.previousPage] });
    ReactGA.event({
      category: "privacy_policy",
      action: "accept_privacy_policy",
    });
  }

  onPrivacyPolicyAccept() {
    this.setState({ isPolicyAccepted: true });
    ReactGA.event({
      category: "privacy_policy",
      action: "accept_privacy_policy",
    });
  }

  onPrivacyPolicyMore() {
    this.previousPage = this.state.page;
    this.setState({ page: Page.PrivacyPolicy });
    ReactGA.send({ hitType: "pageview", title: Page[Page.PrivacyPolicy] });
  }

  onTabChanged(page: Page) {
    this.setState({ page: page });
    ReactGA.send({ hitType: "pageview", title: Page[page] });
    ReactGA.event({
      category: "tabs",
      action: "change_tab",
      label: Page[page],
    });
  }

  isTabsVisible() {
    return this.state.page == Page.PlaceTags || this.state.page == Page.ThemeTags || this.state.page == Page.Places;
  }

  renderTabs() {
    const tabs: Tab[] = [
      { title: i18n["objects"], value: Page.PlaceTags },
      { title: i18n["themes"], value: Page.ThemeTags },
      { title: i18n["route"], value: Page.Places },
    ];
    return <TabSelector tabs={tabs} value={this.state.page} onChange={(p: number) => this.onTabChanged(p as Page)} />;
  }

  renderLoading() {
    return (
      <>
        {this.state.showLoading && (
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

  render() {
    return (
      <Layout
        headerCb={() => {
          this.clearState();
        }}
      >
        {this.state.page == Page.Greetings && <Greetings onExit={this.onGreetingsNext} />}

        {this.state.page == Page.SNServices && <SNServices onExit={this.onSNSExit} onSkip={this.onSNSSkip} />}

        {this.state.page == Page.PrivacyPolicy && <PrivacyPolicy onExit={this.onPrivacyPolicyExit} />}

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
        {this.state.page == Page.Email && (
          <Email onEnterValidEmail={this.onEnterValidEmail} onSend={this.onSend} error={this.state.apiError} />
        )}
        {this.state.page == Page.Final && <Final onMiss={this.onEmailMiss} onExit={this.onFinalClosed} />}
        {!this.state.isPolicyAccepted && this.state.page != Page.PrivacyPolicy && (
          <PrivacyPolicyPopup onExit={this.onPrivacyPolicyAccept} onInfo={this.onPrivacyPolicyMore} />
        )}

        {this.renderLoading()}
      </Layout>
    );
  }
}
