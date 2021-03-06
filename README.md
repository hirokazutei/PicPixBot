# PicPixBot

#### A TwitterBot that turns your photos you tweet at him into cool pixel arts!

## What is it?

His Twitter is @PicPixBot hosted on Amazon EC2.
You can tweet a picture at him, tell him the parameters and he will turn that picture into a pixel art.
Instructions are on his pinned tweet.

## How does it work?

Using node.js, the program uses the stream function to be activated when someone tweet @ the bot. If the tweet comes with an image, that image is saved, processed by [Processing](https://processing.org/), and tweeted with a mention to the original user. If the specified parameters are written wrong or blank, the bot will set random parameters.

Note that in order for the program to successfully connect to the Twitter API, you need your own keys in a file and you also need the TWIT library.

#### Parameters

To keep it simple, only 3 parameters were introduced.
![alt text](https://github.com/hirokazutei/PicPixBot/blob/master/instructionsImages/Instruction%201.png)

##### A. Pixel Type

0. Color Palette
1. Square Pixels
1. Triangles in Horizontal Orientation
1. Triangles in Vertical Orientation
1. Circles
1. Staggered Circles
1. Rectangles in Horizontal Orientation
1. Rectangles in Vertical Orientation
1. Stretched Hexagons
1. Custom Arranged

![alt text](https://github.com/hirokazutei/PicPixBot/blob/master/instructionsImages/Instruction%202.png)

##### B. Pixel Size

Controls the size of the pixels.

![alt text](https://github.com/hirokazutei/PicPixBot/blob/master/instructionsImages/Instruction%203.png)

##### C. Pixel Color Number

The number of colors the program attempts to cluster the available colors of the picture into. The larger the number, the wider range of colors will be used, while 2 will be a binary image of two colors.

![alt text](https://github.com/hirokazutei/PicPixBot/blob/master/instructionsImages/Instruction%204.png)

## Why it was made?

I got an internship job, where I was able to work on whatever I wanted. I wanted to develop a camera app that not only would take pictures of pixelized (in various styles in terms of shapes, sizes, colors, etc.) version of the world, but also be fast enough to show a live preview on the phone screen. However, my title was quickly changed from an intern to a part-time software engineering job, which left the project abandoned.

I figured it would be just as fun to have a TwitterBot online that would pixelize images, so I took on this project for fun. I have always wanted to make a TwitterBot and have it hosted on a server.

If you find any bugs, or have any suggestion for the program, shoot me a message.
