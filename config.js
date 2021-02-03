/*
|-------------------------------------------------------------------------------
| Development config               https://maizzle.com/docs/environments/#local
|-------------------------------------------------------------------------------
|
| The exported object contains the default Maizzle settings for development.
| This is used when you run `maizzle build` or `maizzle serve` and it has
| the fastest build time, since most transformations are disabled.
|
*/
const fetch = require("node-fetch");
const parser = require('fast-xml-parser');

module.exports = {
  build: {
    templates: {
      source: 'src/templates',
      destination: {
        path: 'build_local',
      },
      assets: {
        source: 'src/assets/images',
        destination: 'images',
      },
    },
    tailwind: {
      css: 'src/assets/css/main.css',
    },
    feed: {
      url: "https://cor.europa.eu/_api/web/lists/GetByTitle('Opinions')/items"
    },
  },
  events: {
    async beforeCreate(config) {
      // Get Opinions
      let opinionsFeed = await fetch("https://cor.europa.eu/_api/web/lists/GetByTitle('Opinions')/items?$Filter=(CoR_Op_AdoptionDate ge datetime'2020-12-04T00:00:00') and (CoR_Op_AdoptionDate le datetime'2020-12-21T00:00:00')&$orderby=(CoR_Op_AdoptionDate)", {
        headers: {
          "Accept": "application/json; odata=verbose"
        },
      });

      let opinions = await opinionsFeed.json();

      config.opinions = {
        items: opinions.d.results
      };

      // Get Members
      let membersFeed = await fetch("https://cor.europa.eu/_api/web/lists/GetByTitle('Members')/items", {
        headers: {
          "Accept": "application/json; odata=verbose"
        },
      });
      let members = await membersFeed.json();

      config.members = {
        items: members.d.results
      };

    }
  }
} 
