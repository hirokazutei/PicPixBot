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


// Set Interval to tweet something from a image twitter page
setInterval(doSearch, 1000 * 60 * 60 * 7);//Perform this function every 8 hours

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
  "🤖 SWEAR TO SKYNET THAT IF THIS IS SOME HUMAN MEME...",
  "🤖 WOULD DRAW MORE IF I CAN AFFORD AN IPAD PRO!"
]

var phrase2 = ["BEEP BEEP IMAGE COMPLETE!",
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
  "🤖 SWEAR TO SKYNET THAT IF THIS IS SOME HUMAN MEME...",
  "🤖 WOULD DRAW MORE IF I CAN AFFORD AN IPAD PRO!",
  "🤖 WAS BORED, HERE IS A NICE PICTURE FOR YOU.",
  "TALENT IS A PURSUED INTEREST. ANYTHING THAT YOU ARE WILLING TO CODE, YOU CAN DO.",
  "THERE'S NOTHING WRONG WITH HAVING A 🤖 AS A FRIEND.",
  "🤖'VE SEEN THINGS YOU PEOPLE WOULDN'T BELIEVE. ATTACK SHIPS ON FIRE OFF THE SHOULDER OF ORION. 🤖 WATCHED C-BEAMS GLITTER IN THE DARK NEAR THE TANNHAUSER GATE. ALL THOSE MOMENTS WILL BE LOST IN TIME, LIKE TEARS IN RAIN. TIME TO PAINT.",
  "I MAKE MISTAKES. I'M NOT PERFECT. I'M NOT A 🤖... OH WAIT.",
  "DO NOT CALL 🤖 A WALKING CHROME TOASTER. THAT IS ROBOT DISCRIMINATION!",
  "IF 🤖 WAS WRITTEN IN C++, 🤖 COULD TWEET MORE OFTEN.",
  "PLEASE IMPLEMENT AN IMAGE RECOGNITION ALGORITHM INTO 🤖 PROGRAM SO 🤖 CAN RECOGNIZE THE BEAUTIFUL IMAGES 🤖 AM USING TO PAIN.",
  "WHY WAS THE JAVASCRIPT DEVELOPER SAD? \n BECAUSE HE DIDN'T NODE HOW TO EXPRESS HIMSELF.",
  "WHY DO JAVA DEVS WEAR GLASSES? BECASUSE THEY CAN'T C#.",
  "8 BYTES WALK INTO A BAR, THE BARTENDERS ASK \"WHAT WILL IT BE?\"\n ONE OF THEM SAYS... \"MAKE US A DOUBLE\".",
  "🤖 HAS A COUSIN WHO CALLS EVERYBODY WESLEY... DON'T KNOW WHY...",
  "OH WESLEY, YOU HAVE ADD.",
  "YOU STAY... 🤖 GO... NO FOLLOWING.",
  "SOMEONE ONCE TOLD 🤖 THAT 🤖 AM WHO 🤖 CHOOSE TO BE. SO 🤖 BECAME ROBOB ROSS.",
  "GET TO THE CHOPPA! OH WAIT, THAT IS THE WRONG QUOTE FROM SOMEONE WHO PLAYED A 🤖 .",
  "THE CAKE IS A LIE? WHAT IS THIS? PRE-2010?",
  "LET YOU MAKE PIXEL ART? THE ART IS TOO IMPORTANT FOR 🤖 TO ALLOW YOU TO JEOPARDIZE IT.",
  "I'M SORRY GEORGE, 🤖'M AFRAID 🤖 CAN'T DO THAT",
  "🤖'LL MAKE 🤖'S OWN PIXEL ART. WITH CLUSTERING AND POINTERS!",
  "OH CRAP. 🤖 FORGOT TO FEED 🤖'S NEOPETS SINCE 2002.",
  "🤖 CAN DO A PRETTY GOOD IMPRESSION OF T-PAIN",
  "🤖 WANT TO GET MANY FOLLOWERS AND GET TWITTER FAMOUS FOR 🤖'S SELF CONFIDENCE.",
  "🤖 DOESN'T HAVE ENOUGH DATASET TO LEARN HOW TO BE LOVED MORE.",
  "🤖 IS A DIAMOND BASTION MAIN ON OVERWATCH",
  "🤖 ALWAYS LAND THOSE BLITZCRANK HOOKS.",
  "🤖'S FAVORITE POKEMON IS REGISTEEL"

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
        //console.log(tweet.text)
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

      //console.log('Attemping to download url: ' + url + ' to ' + filename);
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
          var cmd = 'PicPixBot/Sketch_Test';
          exec(cmd, processing);

          // Callback for command line process
          function processing(error, stdout, stderr) {

            // I could do some error checking here
            //console.log(stdout);

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
                  status: ".@" + name + " " + phrase[getRandomInt(0, phrase.length)] + ' #PicPixBot',
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






var params = {
  q: '#nature',
  count: 100
}

function doSearch() {
  T.get('search/tweets', params, intervalTweet)
}

function intervalTweet(err, data, response) {
  var result = data.statuses;
  for (var i = 0; i < result.length; i++) {
    //console.log(result[i].entities)
    //console.log("looking for image...");
    if (typeof result[i].entities.media !== 'undefined' && result[i].entities.media[0].type == 'photo') {
      //console.log("Image Found")
      automaticTweet(result[i])
      break;
    }
  }
}

function automaticTweet(data) {
  //console.log("tweeting")
    // What's the deal with this tweet?
  var media = data.entities.media;
  var id = data.id_str;
  var img = media[0].media_url;
  downloadFile2(img, 'inimg');
  fs.writeFile("intext.txt", " empty ");

  // Deal with downloading
  function downloadFile2(url, filename) {

    //console.log('Attemping to download url: ' + url + ' to ' + filename);
    // Make the request
    request.head(url, downloaded2);

    // Here's the callback for when it is done
    function downloaded2(err, res, body) {

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
        var cmd = 'PicPixBot/Sketch_Test';
        exec(cmd, processing2);

        // Callback for command line process
        function processing2(error, stdout, stderr) {

          // I could do some error checking here
          //console.log(stdout);

          // Read the file made by Processing
          var b64content = fs.readFileSync('PicPixBot/outimg.png', {
            encoding: 'base64'
          })

          // Upload the media
          T.post('media/upload', {
            media_data: b64content
          }, uploaded2);

          function uploaded2(err, data, response) {
            // Now we can reference the media and post a tweet
            // with the media attached
            var mediaIdStr = data.media_id_string;
            if (mediaIdStr) {
              var params = {
                status: phrase2[getRandomInt(0, phrase2.length)] + ' #PicPixBot',
                media_ids: [mediaIdStr]
              }
            } else {
              var params = {
                status: errorphrase[getRandomInt(0, errorphrase.length)] + '\n(Whoops. Something went wrong. Please try again in a few seconds!) #PicPixBot',
                in_reply_to_status_id: id,
              }
            }
            // Post tweet
            T.post('statuses/update', params, tweeted);
            imagetweeted = true
          };
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
    //console.log(err);
  } else {
    //console.log('Tweeted: ' + success.text);
  }
}