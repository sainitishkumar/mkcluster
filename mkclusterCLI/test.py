# this python file is for scraping PR and diff's of the code
# Types of pull requests:
"""

	Features
	Refactors
	Fixes
	Documentation
	Maintenance
	Quality Assesment


"""
import requests
from bs4 import BeautifulSoup

url1 = "https://github.com/tensorflow/tensorflow/pulls"

page1=requests.get(url1)
soup1 = BeautifulSoup(page1.text, 'html.parser')
d = soup1.findAll(class_ = "link-gray-dark")

lis1 = []
lis2 = []

for i in d:
	if("pull" in i['href']):
		pull_number = i["id"][6:-5]
		pull_text = i.contents
		lis2.append(pull_text)
		url = "https://github.com"+str(i["href"])+"/files"
		page=requests.get(url)
		soup = BeautifulSoup(page.text, 'html.parser')
		diff_elems = soup.findAll(class_ = "blob-code-addition")
		lis = []
		for j in diff_elems:
			for k in j:
				if(k!='\n'):
					lis.append(k.contents)
		print(pull_text)
		for j in lis:
			for k in j:
				empty = ""
				try:
					print(k.text, end=" ")
					empty+=k.text
				except:
					print(k, end=" ")
					empty+=k
		s = ""
		for j in diff_elems:
			for k in j:
				if(k!='\n'):
					for l in k:
						try:
							x=str(l.text)
							if(x.startswith("[\'")):
								s+=x[2:-2]
							else:
								s+=x
						except:
							s+=str(l)
				s+="\n"
		lis1.append(s)
		print("\n\n\n\n")
############# gensim ##############

from sklearn.feature_extraction.text import CountVectorizer
import pandas as pd

count_vectorizer = CountVectorizer(stop_words='english')
count_vectorizer = CountVectorizer()

lis3 = []
for i in lis2:
	lis3.append(str(i)[2:-2])

sparse_matrix = count_vectorizer.fit_transform(lis1)

doc_term_matrix = sparse_matrix.todense()
df = pd.DataFrame(doc_term_matrix,columns=count_vectorizer.get_feature_names(),index=[x[0:4] for x in lis1])


from sklearn.metrics.pairwise import cosine_similarity
print(cosine_similarity(df, df))

import gensim
from gensim.matutils import softcossim 
from gensim import corpora
import gensim.downloader as api
from gensim.utils import simple_preprocess

fasttext_model300 = api.load('fasttext-wiki-news-subwords-300')
dictionary = corpora.Dictionary([simple_preprocess(doc) for doc in lis1])

similarity_matrix = fasttext_model300.similarity_matrix(dictionary, tfidf=None, threshold=0.0, exponent=2.0, nonzero_limit=100)

new_lis = [dictionary.doc2bow(simple_preprocess(x)) for x in lis2]
new_lis2 = [dictionary.doc2bow(simple_preprocess(x)) for x in lis1]



print(softcossim(new_lis[0], new_lis[1], similarity_matrix))




# 	temp = i.find_all("span")
# 	if(temp!=[]):
# 		for j in temp:
# 			print(j.contents)





"""
s = ""
for j in diff_elems:
     for k in j:
             if(k!='\n'):
                     for l in k:
                             try:
                                     x=str(l.contents)
                                     if(x.startswith("[\'")):
                                     	s+=x[2:-2]
                                     else:
                                     	s+=x
                             except:
                                     s+=str(l)
                     s+="\n"
             else:
                     s+="\n"

"""