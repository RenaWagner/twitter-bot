require("dotenv").config();
const { TwitterClient } = require("twitter-api-client");
const axios = require("axios");

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

let randomId = Math.floor(Math.random() * 29) + 1;

axios
  .get("https://twitter-chat-bot-be.herokuapp.com/quotes")
  .then((response) => {
    const data = response.data ? response.data : {};
    if (data) {
      const quote = data.find((item) => {
        return item.id === randomId;
      });
      tweet = `Tweet of this hour: ${quote.quote}`;
    } else {
      tweet = "You go girl! You can do this!";
    }
    //Send the tweet
    // twitterClient.tweets
    //   .statusesUpdate({
    //     status: tweet,
    //   })
    //   .then((response) => {
    //     console.log("Tweeted!", response);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  })
  .catch((err) => {
    console.error(err);
  });
