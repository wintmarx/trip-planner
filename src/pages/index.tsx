import React, { useEffect, useMemo } from "react";
import { Location } from "react-router-dom";
import { App, PlaceData } from "../components/app";
import { graphql, useStaticQuery } from "gatsby";

const CSV_ACTIVITIES_QUERY = graphql`
  query {
    allActivitiesCsv {
      nodes {
        name
        description
        who_add
        twogis_nav
        google_nav
        yandex_nav
        photo
        coordinates
        time_to_visit
        price
        working_hours
        number_of_reviews_in_gm
        average_gm_rating
        number_of_ta_reviews
        average_ta_rating
        architectural_structure
        natural_beauty
        religious_object
        museum_exhibition
        park_square
        art_object
        little_know_place
        party
        entertainment_place
        _
        history
        classical_art
        contemporary_art
        music
        movie
        literature
        technologies
        religion
        sport
        fashion
        photos
      }
    }
  }
`;

type ActivityCSV = {
  name: string;
  description: string;
  photo: string;
  time_to_visit: string;
  number_of_reviews_in_gm: string;
  average_gm_rating: string;
  number_of_ta_reviews: string;
  average_ta_rating: string;
  twogis_nav: string;
  google_nav: string;
  yandex_nav: string;
  [x: string]: string;
};

type Tags = {
  places: string[];
  themes: string[];
};

function getQueryVariable(variable: string, location: Location) {
  const query = location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

function convertActivityToPlaceData(tags: Tags, activity: ActivityCSV) {
  return {
    id: activity.photo,
    name: activity.name,
    description: activity.description,
    photo: `photo/${activity.photo}.jpg`,
    ttv: Number(activity.time_to_visit),
    gmReviewsCnt: Number(activity.number_of_reviews_in_gm),
    gmRating: Number(activity.average_gm_rating),
    taReviewsCnt: Number(activity.number_of_ta_reviews),
    taRating: Number(activity.average_ta_rating),
    twogisLink: activity.twogis_nav,
    googleLink: activity.google_nav,
    yandexLink: activity.yandex_nav,
    tags: {
      places: tags.places.filter((placeTag) => activity[placeTag] == "+"),
      themes: tags.themes.filter((themeTag) => activity[themeTag] == "+"),
    },
  } as PlaceData;
}

function parseTags(activitiesCSV: ActivityCSV[]) {
  const keys = Object.keys(activitiesCSV[0]);
  const beginPos = keys.findIndex((el) => el === "average_ta_rating");
  const delimPos = keys.findIndex((el) => el === "_");
  return {
    places: keys.slice(beginPos + 1, delimPos),
    themes: keys.slice(delimPos + 1),
  } as Tags;
}

export default function MainPage() {
  const loadedCSVActivities = useStaticQuery(CSV_ACTIVITIES_QUERY);
  const activitiesCSV = loadedCSVActivities.allActivitiesCsv.nodes;
  const tags = parseTags(activitiesCSV);
  const places: PlaceData[] = useMemo(
    () => activitiesCSV.map(convertActivityToPlaceData.bind(null, tags)),
    [activitiesCSV, tags]
  );

  // const location = useLocation();
  // const isDebug = typeof getQueryVariable("debug", location) == "string";
  const isDebug = false;

  useEffect(() => {
    document.title = "Trip Planner";
  }, []);

  return <App debug={isDebug} places={places} tags={tags} />;
}
