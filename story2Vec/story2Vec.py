
import yaml
import string
import gensim
import os
from tqdm import tqdm
import numpy as np
import time



year = 2019
dataFolder = '../dataFolder/%i'%year


def read_corpus(fname, tokenize = True, tokens_only=False, minWords = 100):
    with open(fname) as f:
        s = yaml.load(f)
        txt = s['Text']
        if tokenize:
            words = gensim.utils.simple_preprocess(txt, min_len=1)
        else:
            words = txt
            
        if len(words) < minWords:
            print('TOO SHORT: ' + fname + ' (%i words < min %i)'%(len(words), minWords))
            return None
            
        if tokens_only:
            return words
        else:
            #tags = [s[k].strip() for k in ['Title', 'SetInCountry', 'AuthorCountry', 'Category']]
            tags = [fname]
            return gensim.models.doc2vec.TaggedDocument(words, tags)


docs = [f.name for f in os.scandir(dataFolder) if f.is_file()]
docs.sort()

N = len(docs)
k = int(N*.75)

train_docs = docs #docs[0:N]
#test_docs  = docs[k:N]


train_corpus = [read_corpus(os.path.join(dataFolder, fname)) for fname in train_docs]

titles = [doc.tags[0] for doc in train_corpus]


#TODO : check if parameters make sense ?
#Careful: dm_concat might not be good to use?
# model = Doc2Vec(dm=1, dm_concat=1, size=100, window=5, negative=0, hs=1, min_count=2, workers=cores)
#iter = 1?

model = gensim.models.doc2vec.Doc2Vec(vector_size=100, min_count=0)


model.build_vocab(train_corpus)

for e in tqdm(range(5)):
    model.train(train_corpus, total_examples=model.corpus_count, epochs=10)
    

model.save('../dataFolder/gensimModel_%i_%s.m'%(year,time.strftime("%Y%m%d-%H%M%S")))


# # In[180]:


# list(idx) + [3]


# # In[47]:


# compareTexts = {}
# D = []
# for title in tqdm(titles):
#     distances = model.docvecs.distances(title)
#     D += [distances]
#     idx = np.argsort(distances)
#     compareTexts[title] = {'m': (idx[1],  titles[idx[1]],  1-distances[idx[1]]), 
#                            'M': (idx[-1], titles[idx[-1]], 1-distances[idx[-1]])}


# # In[116]:


# #title = titles[584]

# # iidx = titles.index(os.path.join(dataFolder, 'the-first-tahksnahky'))
# # iidx = titles.index(os.path.join(dataFolder, 'stand-up'))
# # iidx = titles.index(os.path.join(dataFolder, 'memories-of-eden'))
# # iidx = titles.index(os.path.join(dataFolder, 'the-first-hitchhike'))

# iidx = titles.index(os.path.join(dataFolder, 'abre-le-boca')) #interesting one

# iidx = titles.index(os.path.join(dataFolder, 'a-girl-exploring-her-limits'))

# title = titles[iidx]


# ttl = title.split('/')[-1]
# print('For ' + ttl + ': \n')
# origTxt = read_corpus(title, tokens_only=True, tokenize=False)
# print(origTxt)
# print('###################')

# for lbl, m in [('Most', 'm') , ('Least' , 'M')]:
#     idx, otherTitle , s = compareTexts[title][m]
#     otherText = read_corpus(otherTitle, tokens_only=True, tokenize=False)
#     print('%s Similar is (%i) %s (%.2f)'%(lbl, idx, otherTitle.split('/')[-1], s))
#     print(otherText)
#     print('###################')
    


# # In[ ]:


# # for doc in docs:
# #     doc_vecs = model.infer_vector(doc.split())
# # # creating a matrix from list of vectors
# # mat = np.stack(doc_vecs)

# # # Clustering Kmeans
# # km_model = KMeans(n_clusters=5)
# # km_model.fit(mat)
# # # Get cluster assignment labels
# # labels = km_model.labels_

# # # Clustering DBScan
# # dbscan_model = DBSCAN()
# # labels = dbscan_model.fit_predict(mat)  


# #DBSCAN or HDBSCAN ?
# # https://hdbscan.readthedocs.io/en/latest/comparing_clustering_algorithms.html#dbscan


# # In[16]:


# from scipy.cluster.hierarchy import ward, dendrogram

# linkage_matrix = ward(D) #define the linkage_matrix using ward clustering pre-computed distances


# # In[ ]:


# linkage_matrix.shape


# # In[159]:


# fig, ax = plt.subplots(figsize=(15, 20)) # set size
# ax = dendrogram(linkage_matrix, p = 5, truncate_mode='level',  orientation="right", labels=titles);

# plt.tick_params(    axis= 'x',          # changes apply to the x-axis
#     which='both',      # both major and minor ticks are affected
#     bottom='off',      # ticks along the bottom edge are off
#     top='off',         # ticks along the top edge are off
#     labelbottom='off')

# plt.tight_layout() #show plot with tight layout

# #uncomment below to save figure
# plt.savefig('ward_clusters2.png', dpi=200) #save figure as ward_clusters


# # In[141]:


# import plotly.plotly as py
# import plotly.figure_factory as ff

# from plotly.offline import download_plotlyjs, init_notebook_mode, plot, iplot
# init_notebook_mode(connected=False)


# # In[148]:


# labels = [t.split('/')[-1] for t in titles]


# # In[155]:


# linkage_matrix[0:10,]


# # In[160]:


# X = np.random.rand(10, 10)
# fig = ff.create_dendrogram(X, orientation='left', labels = labels,
#                            distfun=lambda x: x, linkagefun=lambda x: linkage_matrix)
# fig['layout'].update({'width':1000, 'height':800, 'yaxis':{'tickangle':45}})
# iplot(fig)


# # In[ ]:




