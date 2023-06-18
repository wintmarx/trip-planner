module.exports = {
  siteMetadata: {
    title: "Trip Planner",
    description: "Guide for you trip.",
    author: "FredieJackson",
  },
  plugins: [
    "gatsby-plugin-image",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "data",
        path: `${__dirname}/src/assets/data`,
      },
    },
    "gatsby-transformer-csv",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Trip Planner",
        short_name: "Trip Planner",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/assets/images/gatsby-icon.png", // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /svg/,
        },
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "locale",
        path: `${__dirname}/src/assets/i18n/locale`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `privacy_policy`,
        path: `${__dirname}/src/assets/i18n/privacy_policy`,
      },
    },
    "gatsby-transformer-remark",
  ],
};
