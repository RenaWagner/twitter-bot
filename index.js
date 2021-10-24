require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const http = require("https");
const Twitter = require("twitter");
const request = require("request");

var file = fs.createWriteStream("file.jpg");
var photo;

const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

let randomId = Math.floor(Math.random() * 19) + 1;

var download = async function (uri, filename, callback) {
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
        console.log(`The file is finished downloading.`);
        result = fs.readFileSync("./file.jpg").toString("base64");
        resolve(result);
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
    if (data) {
      const quote = data.find((item) => {
        return item.id === randomId;
      });
      console.log("quote", quote);
      imageSrc = quote.imageSource;
      tweet = `Tweet for you! "${quote.quote}"`;
    } else {
      tweet = "You go girl! You can do this!";
    }

    let mediaFile;
    (async () => {
      mediaFile = await download(imageSrc, "file.jpg");
      return mediaFile;
    })();

    await client.post(
      "media/upload",
      { media: mediaFile },
      function (error, media, response) {
        // console.log("mediaFile tweeting:", mediaFile);
        console.log("media", media);
        if (error) {
          console.log(error);
        } else {
          const status = {
            status: "I tweeted from Node.js!",
            media_ids: media.media_id_string,
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

    return mediaFile;
  } catch (err) {
    console.error(err);
  }
};

fetchData();

//////////////////////////////

// const Twitter = require("twitter");
// const dotenv = require("dotenv");
// const fs = require("fs");

// dotenv.config();

// const client = new Twitter({
//   consumer_key: process.env.TWITTER_API_KEY,
//   consumer_secret: process.env.TWITTER_API_SECRET,
//   access_token_key: process.env.TWITTER_ACCESS_TOKEN,
//   access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
// });

/////////////////////////////////

// const imageData = fs.readFileSync("./helloworld.png"); //replace with the path to your image

// client.post(
//   "media/upload",
//   { media: imageData }, //imageData
//   function (error, media, response) {
//     console.log("imageData", imageData);
//     console.log("media", media);
//     if (error) {
//       console.log(error);
//     } else {
//       const status = {
//         status: "I tweeted from Node.js!",
//         media_ids: media.media_id_string,
//       };

//       client.post("statuses/update", status, function (error, tweet, response) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log("Successfully tweeted an image!");
//         }
//       });
//     }
//   }
// );
