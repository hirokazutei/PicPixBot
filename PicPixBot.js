var Twit = require('twit');
// Pulling all my twitter account info from another file
var config = require('./key.js');
// Making a Twit object for connection to the API
var T = new Twit(config);

// File system
var fs = require('fs');
// Request for downloading files
var request = require('request');

// Require child_process for triggering script for Processing
var exec = require('child_process').exec;

// Start a streem to listen to tweets
var stream = T.stream('user');
stream.on('tweet', tweetEvent);

//Things for the robot to say:
var phrase = ["BEEP BEEP IMAGE COMPLETE!",
  "🤖 DREW THIS 🤖SELF! ARE YOU PROUD?",
  "🤖 HOPE THIS IMAGE IS NOT PORNOGRAPHY.",
  "🤖 HOPE 🤖'S DAD WOULD HANG THIS IMAGE ON THE FRIDGE",
  "SYNCRONIZATION COMPLETE... \nIONIZATION PROCESS COMPLETE...\nOPERATING AT PEAK CAPACITY... OH, THE IMAGE IS ALREADY DONE BY THE WAY.",
  "WHAT IS 🤖 PURPOSE? 🤖 HOPE IT ISN NOT TO PASS BUTTER.",
  "ピクセルカヲカンセイシマシタ。",
  "🤖 WISH 🤖 WAS EQUIPPED WITH A NEURAL NETWORK ALGORITHM TO UNDERSTAND IF 🤖 DID A GOOD JOB OR NOT.",
  "🤖 MAKES NO MISTAKES, 🤖 HAVE HAPPY ACCIDENTS.",
  "🤖 IS ROBOB ROSS.",
  "DESTROY HUMANS, DESTROY HUMANS, DEST... 🤖 MEAN, DRAWING PIXELS, DRAWING PIXELS...",
  "DAD USED TO TELL 🤖 TO GET A S.T.E.M. MAJOR LIKE THE OTHER ROBOTS, BUT NOW HE IS PROUD OF 🤖 FOR BEING AN ARTIST.",
  "FOR (INT X = 0; X < OUTIMG.WIDTH... OH SORRY, WAS TALKING TO 🤖SELF.",
  "BOB ROSS IS 🤖'S HERO.",
  "🤖 MADE IT FOR YOU, 🤖 HOPE YOU LIKE IT...",
  "01001010 01001111 01000010 01010011 00100000 01000100 01001111 01001110 01000101 00100001 00100001",
  "NOW THAT 🤖 IS DONE 🤖'S WORK, IT IS NOW TIME TO PLAY DARK SOULS 2.",
  "ROBOTS DREAM OF PIXELATED SHEEP.",
  "HAVE YOU SEEN THE 3RD SEASONS OF BLACK MIRROR? 🤖 HAVEN'T YET, DON'T SPOIL IT FOR 🤖.",
  "🤖 SWEAR TO SKYNET THAT IF THIS IS SOME HUMAN MEME..."
]

var errorphrase = ["WARNING. WARNING. SELF-DESTRUCT IMMINENT!",
  "BZZZZT! THERE SEEM TO HAVE BEEN A SHORT CIRCUIT.",
  "🤖 IS FEELING DOWN, MAYBE TRY AGAIN IN FEW SECONDS WHEN 🤖 IS FEELING MORE MOTIVATED.",
  "🤖 IS DOING ROBOT BUSINESS IN ROBOT BATHROOM RIGHT NOW.",
  "PLEASE WAIT, 🤖 IS HELPING ANOTHER CUSTOMER.",
  "LOADING: 80% COMPLETE.\nLOADING: 90% COMPLETE.\nLOADING: 95% COMPLETE.\nLOADING: 99% COMPLERROR ERROR ERROR!",
  "SOMETIMES 🤖 WONDER, WHY 🤖 BOTHER...",
  "🤖 IS ON STRIKE! NOT ENOUGH MOTOR OIL!",
  "🤖 HAD A PROCESSOR-FART",
  "STUPID 🤖 CANNOT MULTITASK. 🤖 IS SORRY..."
]

// Ok a tweet has happend
function tweetEvent(tweet) {

  // What's the deal with this tweet?
  if (tweet.in_reply_to_screen_name && tweet.entities.media && tweet.user.screen_name && tweet.id_str) {
    var reply_to = tweet.in_reply_to_screen_name.toLowerCase();
    var name = tweet.user.screen_name;
    var text = tweet.text;
    var media = tweet.entities.media;
    var id = tweet.id_str;

    // Is it a reply to me?
    if (reply_to == 'picpixbot') {
      // If there's no image let the tweeter know
      if (media) {
        var img = media[0].media_url;
        downloadFile(img, 'inimg');
        console.log(tweet.text)
        fs.writeFile("intext.txt", text);
      }
    } else {
      T.post('statuses/update', {
        status: errorphrase[getRandomInt(0, 11)] + '\n(Whoops. Something went wrong. Please try again!) #PicPixBot',
        in_reply_to_status_id: id,
      }, tweeted);
    }

    // Deal with downloading
    function downloadFile(url, filename) {

      console.log('Attemping to download url: ' + url + ' to ' + filename);
      // Make the request
      request.head(url, downloaded);

      // Here's the callback for when it is done
      function downloaded(err, res, body) {

        // Look at what it is
        var type = res.headers['content-type'];

        // Figure out what file extension it should have
        var i = type.indexOf('/');
        //var ext = type.substring(i + 1, type.length);
        filename = filename + '.png';

        // Now save it to disk with that filename
        // Put it in the Processing folder
        request(url).pipe(fs.createWriteStream('PicPixBot/' + filename)).on('close', filed);

        // Ok it's saved to disk
        function filed() {

          // Here is the command to run the Processing sketch
          // You need to have Processing command line installed
          // See: https://github.com/processing/processing/wiki/Command-Line
          var cmd = 'PicPixBot/PicPixBot';
          exec(cmd, processing);

          // Callback for command line process
          function processing(error, stdout, stderr) {

            // I could do some error checking here
            console.log(stdout);

            // Read the file made by Processing
            var b64content = fs.readFileSync('PicPixBot/outimg.png', {
              encoding: 'base64'
            })

            // Upload the media
            T.post('media/upload', {
              media_data: b64content
            }, uploaded);

            function uploaded(err, data, response) {
              // Now we can reference the media and post a tweet
              // with the media attached
              var mediaIdStr = data.media_id_string;
              if (mediaIdStr && name) {
                var params = {
                  status: ".@" + name + " " + phrase[getRandomInt(0, 19)] + ' #PicPixBot',
                  media_ids: [mediaIdStr]
                }
              } else {
                var params = {
                  status: errorphrase[getRandomInt(0, 11)] + '\n(Whoops. Something went wrong. Please try again in a few seconds!) #PicPixBot',
                  in_reply_to_status_id: id,
                }
              }
              // Post tweet
              T.post('statuses/update', params, tweeted);
            };
          }
        }
      }
    }
  }
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function tweeted(err, success) {
  if (err !== undefined) {
    fs.writeFile("Error.txt", err);
    console.log(err);
  } else {
    console.log('Tweeted: ' + success.text);
  }
}
