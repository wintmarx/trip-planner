import React from "react"
import { useLocation } from "@reach/router"
import { App, PlaceData } from "../components/app"
import { StaticQuery, graphql } from "gatsby"

type ActivityCsv = {
  name: any
  description: any
  photo: any
  time_to_visit: any
  number_of_reviews_in_gm: any
  average_gm_rating: any
  number_of_ta_reviews: any
  average_ta_rating: any
  [x: string]: string
}

function getQueryVariable(variable: string, location: any) {
  var query = location.search.substring(1)
  var vars = query.split("&")
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=")
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return false
}

const IndexPage: React.FC = () => (
  <StaticQuery
    query={graphql`
      query {
        allActivitiesCsv {
          nodes {
            name
            description
            who_add
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
      const activitiesCsv = data.allActivitiesCsv.nodes
      const keys = Object.keys(activitiesCsv[0])
      const beginPos = keys.findIndex(el => el === "average_ta_rating")
      const delPos = keys.findIndex(el => el === "_")
      const tags = {
        places: keys.slice(beginPos + 1, delPos),
        themes: keys.slice(delPos + 1),
      }
      const places: PlaceData[] = activitiesCsv.map(
        (el: ActivityCsv) =>
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
            tags: {
              places: tags.places.filter(placeTag => el[placeTag] == "+"),
              themes: tags.themes.filter(themeTag => el[themeTag] == "+"),
            },
          } as PlaceData)
      )

      const location = useLocation()
      const isDebug = typeof getQueryVariable("debug", location) == "string"

      return <App debug={isDebug} places={places} tags={tags} />
    }}
  />
)

export default IndexPage
