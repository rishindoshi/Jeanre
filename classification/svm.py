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
import numpy as np

class Predict:
	"""
	Function responsible for making predictions
	"""
	X = []
	Y = []
	classifier = None	

	def __init__(self, *args):
		"""
		Set object's training data / labels from input files
		"""
		self.X = args[0]
		self.Y = args[1]

	def train(self, *args):
		"""
		Here we play around with how we train the model
		This classifier will use an 'rbf' kernel.
		"""
		print self.X
		print self.Y
		self.classifier = svm.SVC(decision_function_shape='ovo')
		self.classifier.fit(self.X,self.Y)
	
	def predict(self, inp):
		if self.classifier is None:
			print "no classifier trained yet"
			return none
		return self.classifier.predict(inp)

def readFiles(filename):
	in_x = []
	numfeatures = 0
	with open(filename, 'r') as f:
		z = f.readline() #reading the first line for features
		numfeatures = len(z.split(","))
		print "Training with features: " + z
		for line in f:
			in_x.append(line.split(","))
	return [[row[i] for i in xrange(0,numfeatures-1)] for row in in_x] 

def main():
	"""
	This project is meant for us to practice with a machine
	learning model with an interesting classification problem!

	This python script will read from four files. It will use
	training data and label files to train the model. Then it
	will try to predict the genres of songs based on the test
	data file. Finally, we will compare results of the
	predictions against the test label file to see what %
	accuracy our model achieved.
	"""	
	#Read X,Y training data from files
	print "Reading files..."
	in_y = []
	in_x = []
	filenamez = ['training_data/Indie.txt', 'training_data/Party.txt']
	fileclass = 1
	for fil in filenamez:
		genre = readFiles(fil)
		in_x.extend(genre)
		in_y.extend([fileclass] * len(genre))
		fileclass = fileclass + 1
	
	#Train the model with our collected data
	classifier = Predict(in_x, in_y)
	print "Training SVM..."
	classifier.train()

	#Make predictions based on test data and compare results
	#  against the labels from the test labels file
	print "Making predictions..."
	num_incorrect = 0 #number of incorrect predictions
	print classifier.predict(in_x)

if __name__ == "__main__": 
	main()
