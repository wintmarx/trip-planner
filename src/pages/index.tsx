import React, { useEffect } from "react";
import {
  useLocation,
  Location,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { App, PlaceData } from "../components/app";
import { StaticQuery, graphql } from "gatsby";

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

const IndexPage: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <StaticQuery
            query={graphql`
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
            `}
            render={data => {
              const activitiesCSV = data.allActivitiesCsv.nodes;
              const keys = Object.keys(activitiesCSV[0]);
              const beginPos = keys.findIndex(el => el === "average_ta_rating");
              const delPos = keys.findIndex(el => el === "_");
              const tags = {
                places: keys.slice(beginPos + 1, delPos),
                themes: keys.slice(delPos + 1),
              };
              const places: PlaceData[] = activitiesCSV.map(
                (el: ActivityCSV) =>
                  ({
                    id: el.photo,
                    name: el.name,
                    description: el.description,
                    photo: `photo/${el.photo}.jpg`,
                    ttv: Number(el.time_to_visit),
                    gmReviewsCnt: Number(el.number_of_reviews_in_gm),
                    gmRating: Number(el.average_gm_rating),
                    taReviewsCnt: Number(el.number_of_ta_reviews),
                    taRating: Number(el.average_ta_rating),
                    twogisLink: el.twogis_nav,
                    googleLink: el.google_nav,
                    yandexLink: el.yandex_nav,
                    tags: {
                      places: tags.places.filter(
                        placeTag => el[placeTag] == "+"
                      ),
                      themes: tags.themes.filter(
                        themeTag => el[themeTag] == "+"
                      ),
                    },
                  } as PlaceData)
              );

              const location = useLocation();
              const isDebug =
                typeof getQueryVariable("debug", location) == "string";

              useEffect(() => {
                document.title = "Trip Planner";
              }, []);

              return <App debug={isDebug} places={places} tags={tags} />;
            }}
          />
        }
      />
    </Routes>
  </BrowserRouter>
);

export default IndexPage;
