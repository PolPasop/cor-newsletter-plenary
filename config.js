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
        let feed = await fetch("https://cor.europa.eu/_api/web/lists/GetByTitle('Opinions')/items?SortField%3DCoR_Op_AdoptionDate-SortDir%3DAsc", {
          headers: {
            "Accept": "application/json; odata=verbose"
          },
        });
        let opinions = await feed.json();
        
        config.opinions = {
          items: opinions.d.results
        };

        console.log(config.opinions);
        /*
        .then(function(response) {
          const json = response.json();
          return json;
        }).then( json => {
          config.opinions = {
            items: json.d.results
          }

          console.log(config.opinions);
        })
        */
      }
  }
} 
