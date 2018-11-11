const MILLISECONDS = 1000;
const SECONDS = 60;
const MINUTES = 60;
const HOURS = 8;

export const CMD_LOCAL = "processing-java --sketch=`pwd`/src/PicPixBot --run";
export const CMD_PROD = "`pwd`/src/PicPixBot/Sketch_Test";
export const HANDLE_NAME = "picpixbot";
export const INPUT_PATH = "src/PicPixBot/inimg.png";
export const OUTPUT_PATH = "src/PicPixBot/outimg.png";
export const RANDOM_TYPE = [0, 10];
export const RANDOM_SIZE = [3, 20];
export const RANDOM_SAMPLE = [2, 50];
export const SEARCH_PARAMS = {
  q: "#naturephotography",
  count: 100
};
export const TWEET_INTERVAL = 1000 * 60 * 60 * 7.5;
