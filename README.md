## Setup

- Clone the repo
- run `npm install` on the repo to load dependencies
- running `npm start` will build and run the code
- running `npm test` will run the unit tests


## Overview

The approach I took to this challenge was to try and split the bios and job descriptions into key word tokens and then 
to match these together with a weighted scoring.

The biggest issue with this design was the need to encapsulate a lot of domain knowledge in the code for effective 
matching as well as a having to tune the heuristic for a positive match. Further to this the introduction of scoring 
being affected by previous context of the string is something that could easily swell in complexity.

To develop this code further my first choice would be researching well-developed lexical parsers that could tokenise and
categorise the incoming data for us so that we could ideally handle new types of job or locations much more generically.

One of the big issues with the scoring is that we are looping through the entire set of jobs to find the matches, 
ideally the tokens for candidate and job could be more aware of their category and with this we could filter out bad
matches before doing a full compare.
