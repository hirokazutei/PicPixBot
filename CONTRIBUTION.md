# Contribution
 
## Future Implementations

### Automatically Tweeting Picture

Currently, the TwitterBot only tweets when tweeted to, but it would be interesting to scour Twitter for random images, pixelize them and tweet it every two hours or so.

### Other Types of Pixel Effects

The pixel effects that I have written for this bot are not at all processor intensive. Other more complex patterns and arrangement of colors can be interesting.

### Processing Multiple Images at Once

I had expected more traffic when I made this bot (at least temporarily) so I did not implement a way for it to process multiple pictures being tweeted to him.

## Bugs & Fixes

### Possible Tweets from Locked Accounts

For some reason, the bot tweets an error message for no apparent reason. I hypothesize that someone with a locked account is tweeting at it, thus while the bot can detect that he should be running, he cannot have access to that tweet, resulting in an error.
