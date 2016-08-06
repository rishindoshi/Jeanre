"""
With the training data gathered from 'training',
we will feed it into Scikit's SVM to classify songs
based on features.

SVC uses a "one vs one" method, so if we want to have 4 different
classes, the library will generate 4C2 different classifiers -- 
that is 4!(4-2)! / 2!. We chose to use this classifier because we
think that if we had used a "one vs all" method, the classifiers
would see unbalanced distributions due to the fact that they will
see many more negative labels than positive labels.
"""
from sklearn import svm
from sklearn import preprocessing

class Predict:
	"""
	Function responsible for making predictions
	"""
	X = []
	Y = []	

	def __init__(self, *args):
		"""
		Attempt to grab training data from 'training'
		"""

	def predict(self, X, Y, inp):
		"""
		This classifier will default to use an 'rbf' kernel.
		"""
		scaled_x = preprocessing.scale(X)

		classifier = svm.SVC(decision_function_shape='ovo')
		classifier.fit(X,Y)

		classifier.predict(inp)
