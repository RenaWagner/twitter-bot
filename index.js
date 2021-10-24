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

let randomId = Math.floor(Math.random() * 29) + 1;

var download = async function (uri, filename, callback) {
  let result;
  /* Create an empty file where we can save data */
  const file = fs.createWriteStream(filename);

  /* Using Promises so that we can use the ASYNC AWAIT syntax */
  await new Promise((resolve, reject) => {
    request({
      /* Here you should specify the exact link to the file you are trying to download */
      uri: uri,
      gzip: true,
    })
      .pipe(file)
      .on("finish", async () => {
        console.log(`The file is finished downloading.`);
        result = fs.readFileSync("./file.jpg");
        return result;
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
      console.log("mediafile in Fetch data", mediaFile);
      return mediaFile;
    })();
  } catch (err) {
    console.error(err);
  }
};

const tweetData = async () => {
  try {
    const mediaFile = await fetchData();
    client.post(
      "media/upload",
      { media: mediaFile },
      function (error, media, response) {
        console.log("mediaFile", mediaFile);
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
  } catch (err) {
    console.error(err);
  }
};
tweetData();

// axios
//   .get("https://twitter-chat-bot-be.herokuapp.com/quotes")
//   .then((response) => {
//     const data = response.data ? response.data : {};
//     if (data) {
//       const quote = data.find((item) => {
//         return item.id === randomId;
//       });
//       console.log("quote", quote);
//       const imageSrc = quote.imageSource;
//       tweet = `Tweet for you! "${quote.quote}"`;

//       var request = http.get(imageSrc, function (response) {
//         response.pipe(file);
//         response.on("close", function () {
//           resolve();
//         });
//         response.on("end", function () {
//           resolve();
//         });
//         response.on("finish", function () {
//           resolve();
//         });
//       });
//     } else {
//       tweet = "You go girl! You can do this!";
//     }
//   })
//   .then(() => {
//     var data = fs.readFileSync(`${__dirname}/file.jpg`);
//     client.post("media/upload", { media: data });
//   })
//   .then((media) => {
//     console.log("media uploaded");
//     client.post(
//       "media/upload",
//       { media: data }, //imageData
//       function (error, media, response) {
//         if (error) {
//           console.log(error);
//         } else {
//           const status = {
//             status: "I tweeted from Node.js!",
//             media_ids: media.media_id_string,
//           };
//           client.post(
//             "statuses/update",
//             status,
//             function (error, tweet, response) {
//               if (error) {
//                 console.log(error);
//               } else {
//                 console.log("Successfully tweeted an image!");
//               }
//             }
//           );
//         }
//       }
//     );
//   })

//   .catch((err) => {
//     console.error(err);
//   });

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

// const imageData = fs.readFileSync("./helloworld.png"); //replace with the path to your image

// client.post(
//   "media/upload",
//   { media: imageData }, //imageData
//   function (error, media, response) {
//     console.log("imageData", imageData);
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
