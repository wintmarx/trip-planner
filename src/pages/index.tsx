import React from "react"
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
            name: el.name,
            description: el.description,
            photo: el.photo,
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

      return <App places={places} tags={tags} />
    }}
  />
)

export default IndexPage
