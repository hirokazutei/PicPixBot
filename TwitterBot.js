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
setInterval(doSearch, 1000 * 60 * 60 * 8);//Perform this function every 8 hours

//Things for the robot to say:
var phrase = require('./phrases.js');
var phrase2 = require('./phrases2.js');
var errormessages = require('./errormessages.js');

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
          var cmd = 'PicPixBot/Sketch_Test';
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
    console.log(result[i].entities)
    console.log("looking for image...");
    if (typeof result[i].entities.media !== 'undefined' && result[i].entities.media[0].type == 'photo') {
      console.log("COOOL")
      automaticTweet(result[i])
      break;
    }
  }
}

function automaticTweet(data) {
  console.log("tweeting")
    // What's the deal with this tweet?
  var media = data.entities.media;
  var id = data.id_str;
  var img = media[0].media_url;
  downloadFile2(img, 'inimg');

  // Deal with downloading
  function downloadFile2(url, filename) {

    console.log('Attemping to download url: ' + url + ' to ' + filename);
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
          console.log(stdout);

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
    console.log(err);
  } else {
    console.log('Tweeted: ' + success.text);
  }
}