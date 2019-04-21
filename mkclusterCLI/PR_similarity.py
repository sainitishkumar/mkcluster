
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

