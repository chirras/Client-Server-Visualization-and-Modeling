import sys
import json
from flask import Flask
from flask_restful import Resource, Api
from flask import render_template
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_curve
from flask import jsonify
import pandas as pd
import numpy as np

app = Flask(__name__)
api = Api(app)

class ROC(Resource):
	def get(self, preprocessing, c):
		# you need to preprocess the data according to user preferences (only fit preprocessing on train data)
		# fit the model on the training set
		# predict probabilities on test set
		# Defining the scaler based on the user input
		if(preprocessing == "StandardScaler"):
			scaler = StandardScaler()
		elif(preprocessing == "MinMax"):
			scaler = MinMaxScaler()
		else:
			print("Please enter a valid scaler")
			sys.exit()
		# Scaling the train and test datasets
		X_train_Scaled = scaler.fit_transform(X_train)
		X_test_Sclaed = scaler.transform(X_test)
		# Logistic Regression
		modelLR = LogisticRegression(C=float(c))
		modelLR.fit(X_train_Scaled, y_train)
		# Predicting on the test data
		y_pred = modelLR.predict(X_test_Sclaed)
		# ROC_Curve
		fpr, tpr, thresholds = roc_curve(y_test, y_pred)
		# return the false positives, true positives, and thresholds using roc_curve()
		#return  '{} {} {}'.format(fpr, tpr, thresholds)
		rocData = {"FalsePositive": {i:float(fpr[i]) for i in range(len(fpr))}, "TruePositive": {i:float(tpr[i]) for i in range(len(tpr))}, 
			"Threshold": {i:float(thresholds[i]) for i in range(len(thresholds))}}

		return json.dumps((rocData))



# Here you need to add the ROC resource, ex: api.add_resource(HelloWorld, '/')
# for examples see 
# https://flask-restful.readthedocs.io/en/latest/quickstart.html#a-minimal-api

# Adding class to resource
api.add_resource(ROC, '/<string:preprocessing>/<c>')


if __name__ == '__main__':
	# load data
	columnNames = ['Recency','Frequency','Monetary','Time','Donated']
	df = pd.read_csv("/Users/satishreddychirra/Document/DS5500 Data Visualization/Transfusion.data.txt", 
		skiprows=1, names=columnNames, header=None)
	xDf = df.loc[:, df.columns != 'Donated']
	y = df['Donated']
	# get random numbers to split into train and test
	np.random.seed(1)
	r = np.random.rand(len(df))
	# split into train test
	X_train = xDf[r < 0.8]
	X_test = xDf[r >= 0.8]
	y_train = y[r < 0.8]
	y_test = y[r >= 0.8]
	app.run(debug=True)








































