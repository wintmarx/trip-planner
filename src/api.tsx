import axios, { AxiosInstance } from "axios"

export type TripRequestPlace = {
  photo: string
  title: string
  desc: string
  ttv: number
  googleLink: string
  twogisLink: string
  yandexLink: string
}

export type TripRequestData = {
  email: string
  places: TripRequestPlace[]
}

export class Api {
  client: AxiosInstance
  constructor() {
    this.client = axios.create({
      baseURL: process.env.GATSBY_API_ENDPOINT,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  requestTrip(data: TripRequestData) {
    return this.client.post("/trip", data)
  }
}
