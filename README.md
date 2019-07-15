# Scraping
Files are obtained from the submissions of writers to the travel nomad website
Code is inside the ./scraper folder.
Took about ~4 hours of coding and ~24 hrs to download (slow connection while travelling in Sri Lanka :p)


# NLP

still work in progress ... for now, using doc2vec 

* Build a classifier and a way to explore the corpus of stories. Perhaps associate each cluster with some images (pulled from Web?)
* Come up with one sentence summaries for each of the stories? Is there such a thing as an SVD for doc2Vec?

other options (might require more of a server side)
* Generate new stories based on a "seed" sentence?

# Visualizing
Also work in progress. Experimenting with Cytoscape. Some ideas:

* Allow easy exploring of stories - filter by author country, set in country, topic, etc.
* Make it possible to find "most similar story" or "least similar story". Maybe this is visualized by edges somehow?


# Running locally
cd storiesViz
python -m http.server

# Deploying
Host the storiesViz folder on a webserver (AWS, GCloud, etc.)


# Readings & References:

https://www.datanovia.com/en/lessons/determining-the-optimal-number-of-clusters-3-must-know-methods/

https://medium.com/@david.campion/text-generation-using-bidirectional-lstm-and-doc2vec-models-2-3-f0fc07ee7b30

https://radimrehurek.com/gensim/

[Distributed Representations of Sentences and Documents](https://arxiv.org/pdf/1405.4053.pdf)

[An Empirical Evaluation of doc2vec with Practical Insights into Document Embedding Generation](https://www.aclweb.org/anthology/W16-1609)	