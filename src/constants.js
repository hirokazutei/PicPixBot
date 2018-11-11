const MILLISECONDS = 1000;
const SECONDS = 60;
const MINUTES = 60;
const HOURS = 8;

export const CMD_LOCAL = "processing-java --sketch=`pwd`/src/PicPixBot --run";
export const CMD_PROD = "`pwd`/src/PicPixBot/Sketch_Test";
export const TWEET_INTERVAL = 1000 * 60 * 60 * 7.5;
export const HANDLE_NAME = "picpixbot";
export const INPUT_PATH = "src/PicPixBot/inimg.png";
export const OUTPUT_PATH = "src/PicPixBot/outimg.png";
export const SEARCH_PARAMS = {
  q: "#naturephotography",
  count: 100
};
