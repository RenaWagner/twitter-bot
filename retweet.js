require("dotenv").config();
const { TwitterClient } = require("twitter-api-client");

const twitterClient = new TwitterClient({
  // apiKey: process.env.TWITTER_API_KEY,
  // apiSecret: process.env.TWITTER_API_SECRET,
  // accessToken: process.env.TWITTER_ACCESS_TOKEN,
  // accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  apiKey: "3aLNgJXIyJacMqbKKpj8zVk8o",
  apiSecret: "I4rgfbcy4q4tuhUMINDyZXYgBQHklI5PUDIW7pkoDkBljIGdb6",
  accessToken: "1451559947808952327-xPD6n4zyWTVTRaG4yqooxitC9h3sqi",
  accessTokenSecret: "8gDQCjToITlqQxo0REqt8ks04Xam8FTfaCxZtvjUEN4LN",
});

twitterClient.tweets
  .search({
    q: "#Girlpower",
    result_type: "recent", //get latest tweets with this hashtag
  })
  .then((response) => {
    if (response.statuses) {
      response.statuses.forEach((status) => {
        twitterClient.tweets
          .statusesRetweetById({
            id: status.id_str,
          })
          .then((resp) => console.log(`Retweeted tweet #${status.id}`))
          .catch((err) => console.error(err));
      });
    }
  })
  .catch((err) => console.error(err));
