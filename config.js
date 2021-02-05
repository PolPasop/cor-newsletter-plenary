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
  socialmedia: [
    {
      url: "https://twitter.com/EU_CoR",
      name: "Twitter",
      logoUrl: "https://cor.europa.eu/SiteCollectionImages/Newsletter/PostPlenaryNewsletter/logo-twitter.png"
    },
    {
      url: "https://www.facebook.com/European.Committee.of.the.Regions/",
      name: "Facebook",
      logoUrl: "https://cor.europa.eu/SiteCollectionImages/Newsletter/PostPlenaryNewsletter/logo-facebook.png"
    },
    {
      url: "https://www.instagram.com/eu_regions_cities/",
      name: "Instagram",
      logoUrl: "https://cor.europa.eu/SiteCollectionImages/Newsletter/PostPlenaryNewsletter/logo-instagram.png"
    },
    {
      url: "https://www.linkedin.com/company/european-committee-of-the-regions/",
      name: "Linkedin",
      logoUrl: "https://cor.europa.eu/SiteCollectionImages/Newsletter/PostPlenaryNewsletter/logo-linkedin.png"
    },
    {
      url: "http://www.youtube.com/user/pressecdr?hl=fr",
      name: "Youtube",
      logoUrl: "https://cor.europa.eu/SiteCollectionImages/Newsletter/PostPlenaryNewsletter/logo-youtube.png"
    },
    {
      url: "http://www.flickr.com/photos/62673028@N02/sets",
      name: "Flickr",
      logoUrl: "https://cor.europa.eu/SiteCollectionImages/Newsletter/PostPlenaryNewsletter/logo-flickr.png"
    }
  ],
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

      // Get Debates
      let debatesFeed = await fetch("https://cor.europa.eu/_layouts/15/restapi/restapi.aspx?op=GetAllListItems&site=/en/our-work/plenaries&list=debates&order=Plenary_Debate_Date");
      let debates = await debatesFeed.json();

      config.debates = {
        items: debates.d.results
      };

      // get url from video field
      [...config.debates.items].map( debate => debate.Plenary_Debate_VideoLinkURL = debate.Plenary_Debate_VideoLink.substr(0, debate.Plenary_Debate_VideoLink.indexOf(',')));
      // get src from Speakerpictures
      [...config.debates.items].map( debate => {
        const regex = /<img.*?src=['"](.*?)['"]/;
        debate.Plenary_Debate_SpeakerPictureURL = "https://cor.europa.eu" + regex.exec(debate.Plenary_Debate_SpeakerPicture)[1];;
      });

    }
  },
} 
