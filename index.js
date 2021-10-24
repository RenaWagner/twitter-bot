require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const Twitter = require("twitter");
const request = require("request");

var file = fs.createWriteStream("file.jpg");

const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

let randomId = Math.floor(Math.random() * 25);

var download = async function (uri, filename, quote) {
  let result;
  /* Create an empty file where we can save data */
  const file = fs.createWriteStream(filename);

  /* Using Promises so that we can use the ASYNC AWAIT syntax */
  return new Promise((resolve, reject) => {
    request({
      /* Here you should specify the exact link to the file you are trying to download */
      uri: uri,
      gzip: true,
    })
      .pipe(file)
      .on("finish", async () => {
        result = fs.readFileSync("./file.jpg");
        resolve({
          media: result,
          quote: quote,
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  }).catch((error) => {
    console.log(`Something happened: ${error}`);
  });
};

const fetchData = async () => {
  try {
    let imageSrc;
    const response = await axios.get(
      "https://twitter-chat-bot-be.herokuapp.com/quotes"
    );
    const data = response.data ? response.data : {};
    let quote;
    if (data) {
      quote = data.find((item) => {
        return item.id === randomId;
      });
      imageSrc = quote.imageSource;
    }
    return await download(imageSrc, "file.jpg", quote);
  } catch (err) {
    console.error(err);
  }
};

const tweetData = async () => {
  try {
    const mediaFile = await fetchData();
    client.post(
      "media/upload",
      { media: mediaFile.media },
      function (error, data, response) {
        if (error) {
          console.log(error);
        } else {
          const status = {
            status: `Tweet for you! "${mediaFile.quote.quote}"`,
            media_ids: data.media_id_string,
          };
          client.post(
            "statuses/update",
            status,
            function (error, tweet, response) {
              if (error) {
                console.log(error);
              } else {
                console.log("Successfully tweeted an image!");
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
};

tweetData();
