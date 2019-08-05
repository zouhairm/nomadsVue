# Intro & Motivation
 This project is intended to help explore travel stories by thousands of people that have been submitted to the Travel Nomad Contest.

Hopefully this makes the submissions of these aspiring writers fun to explore, and that a wide audience of users finds it interesting; whether it be aspiring travel writers, daydreaming office workers thinking about exploring a new destination, or social scientists interested in understanding why and how people travel.

In a time where it feels like differences between nations and their people are amplified, I hope this serves as reminder that so many of us are connected through the way we experience our planet and each other.

For more background, insights, and technical details; check out this [Blog Post](https://zouhairm.github.io/writerBlock)

This project is made possible thanks to the following packages and data:

* [Travel Nomad Stories](https://www.worldnomads.com/create/scholarships/writing/2018/results)
* [GenSim (Doc2Vec)](https://radimrehurek.com/gensim/models/doc2vec.html)
* [Vue.js](https://github.com/vuejs/awesome-vue)
* [VivaGraphJS (w/ WebGL renderer)](https://github.com/anvaka/VivaGraphJS)
* [Mapbox](https://www.mapbox.com/)


# Scraping
Files are obtained from the submissions of writers to the travel nomad website
Code is inside the `./scraper` folder.
Took about ~4 hours of coding and ~24 hrs to download (slow connection while travelling in Sri Lanka :p)


# NLP
still work in progress ... for now, using doc2vec. Details in `story2Vec` folder.

# Visualizing
After experimenting with Cytoscape, settled on VivaGraphJS. 

# Running locally
```
npm install
npm run serve
```

# Deploying
The  script `./deploy.sh` runs `npm run build` and pushes the dist folder to github.