import Twit from "twit";
import fs from "fs";
import request from "request";
import { CREDENTIALS, CONFIG } from "./key";
import { ERROR_PHRASES, PHRASES } from "./phrases";
import { getRandomInt } from "./helpers";
import {
  CMD_LOCAL,
  CMD_PROD,
  HANDLE_NAME,
  INPUT_PATH,
  OUTPUT_PATH,
  RANDOM_TYPE,
  RANDOM_SIZE,
  RANDOM_SAMPLE,
  SEARCH_PARAMS,
  TWEET_INTERVAL
} from "./constants";
import { format } from "url";

// logger
const log = require("simple-node-logger").createSimpleLogger("project.log");
log.setLevel("error");

// Require child_process for triggering script for Processing
const exec = require("child_process").exec;

const T = new Twit(CREDENTIALS);

// Process and Tweet a picture when users tweet a picture at @picpixbot
const tweetStream = T.stream("statuses/filter", {
  track: "picpixbot"
});
tweetStream.on("tweet", tweet => {
  tweetEvent(tweet);
});

// Set Interval to tweet something from a image twitter page
setInterval(
  () => T.get("search/tweets", SEARCH_PARAMS, intervalTweet),
  TWEET_INTERVAL
);

function intervalTweet(error, data, response) {
  if (typeof error !== "undefined" || typeof data === "undefined") {
    console.error(`Search Error: ${error}`);
  } else {
    const validTweets = [];
    for (let i = 0; i < data.statuses.length; i++) {
      if (
        typeof data.statuses[i].entities.media !== "undefined" &&
        data.statuses[i].entities.media[0].type == "photo"
      ) {
        validTweets.push(data.statuses[i]);
      }
    }
    if (validTweets.length > 0) {
      const randomType = getRandomInt(RANDOM_TYPE[0], RANDOM_TYPE[1]);
      const randomSize = getRandomInt(RANDOM_SIZE[0], RANDOM_SIZE[1]);
      const randomSample = getRandomInt(RANDOM_SAMPLE[0], RANDOM_SAMPLE[1]);
      const randomText = `@picpixbot ${randomType} ${randomSize} ${randomSample}`;
      // This is just to control random samples without changing processing file
      fs.writeFile("src/intext.txt", randomText, error => {
        if (error) {
          console.error(`Write Fle Error!`);
        } else {
          startProcess(
            false,
            validTweets[getRandomInt(0, validTweets.length - 1)]
          );
        }
      });
    }
  }
}

function tweetEvent(tweet) {
  if (tweet.in_reply_to_screen_name && tweet.entities.media) {
    const mention = tweet.in_reply_to_screen_name.toLowerCase();
    // Check if it is a mention to the bot
    if (mention === HANDLE_NAME) {
      // Write down the tweet content for processing parameters
      fs.writeFile("src/intext.txt", tweet.text, error => {
        if (error) {
          console.error(`Write Fle Error!`);
        } else {
          startProcess(true, tweet);
        }
      });
    } else {
      T.post(
        "statuses/update",
        {
          status: `${
            ERROR_PHRASES[(0, Math.floor(Math.random() * ERROR_PHRASES.length))]
          }\n(Whoops. Something went wrong. Please try again!) #PicPixBot`,
          in_reply_to_status_id: tweet.id_str
        },
        tweeted
      );
    }
  }
}

function startProcess(isMention, tweet) {
  const params = {
    name: tweet.user.screen_name,
    text: tweet.text,
    media: tweet.entities.media,
    id: tweet.id_str,
    isMention
  };
  const imgURL = params.media[0].media_url;
  request.head(imgURL, (error, response, body) => {
    if (error || typeof response === "undefined") {
      console.error(`Request Head Error: ${error}`);
    }
    downloadImage(params, imgURL, response);
  });
}

function downloadImage(params, imgURL, response) {
  const type = response.headers["content-type"];
  request(imgURL)
    .pipe(fs.createWriteStream(INPUT_PATH))
    .on("close", error => {
      if (typeof error !== "undefined") {
        console.error(`Create Write Stream Error: ${error}`);
      } else {
        processImage(params);
      }
    });
}

function processImage(params) {
  // Here is the command to run the Processing sketch
  // You need to have Processing command line installed
  // See: https://github.com/processing/processing/wiki/Command-Line
  const cmd = CONFIG.env === "production" ? CMD_PROD : CMD_LOCAL;
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Command error: ${error}`);
    } else {
      uploadImage(params);
    }
  });
}

// Callback for command line process
async function uploadImage(params) {
  // Read the file made by Processing
  const b64content = fs.readFileSync(OUTPUT_PATH, {
    encoding: "base64"
  });
  await T.post(
    "media/upload",
    { media_data: b64content },
    (error, data, response) => {
      if (typeof error !== "undefined") {
        console.error(`Tweet Post Error: ${error}`);
      } else {
        finalizeTweet(params, data, response);
      }
    }
  );
}

function finalizeTweet(params, data, response) {
  // Now we can reference the media and post a tweet
  // with the media attached
  const mediaIdStr = data.media_id_string;
  if (mediaIdStr && (!response || params.name)) {
    const mention = params.isMention ? `@${params.name} ` : "";
    const credit = params.isMention ? "" : `credit: @${params.name}`;
    const content = `${mention}${
      PHRASES[(0, Math.floor(Math.random() * PHRASES.length))]
    } ${credit} #PicPixBot`;

    const payload = {
      status: content,
      media_ids: [mediaIdStr]
    };
    T.post("statuses/update", payload, tweeted);
  } else {
    const errorContent = `${
      ERROR_PHRASES[(0, Math.floor(Math.random() * ERROR_PHRASES.length))]
    } \n(Whoops. Something went wrong. Please try again in a few seconds!) #PicPixBot`;
    const payload = {
      status: errorContent
    };
    T.post("statuses/update", payload, tweeted);
  }
}

function tweeted(error, success) {
  if (typeof error !== "undefined") {
    console.error(`Tweet Error: ${error}`);
  }
}
