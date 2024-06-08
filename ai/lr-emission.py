import csv
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

data = []
dataY = []

with open('datasets/emission.csv', mode ='r')as file:
  csvFile = csv.reader(file)
  for ind, lines in enumerate(csvFile):
        if ind != 0:
            data.append([float(lines[4]), float(lines[10])])
            dataY.append(float(lines[12]))


x_train, x_test, y_train, y_test = train_test_split(data,dataY,train_size=0.25)

regression = LinearRegression().fit(x_train, y_train)
y_prediction = regression.predict(x_test)
coeff = regression.coef_

print("Coefficients: \n", regression.coef_)
print("Mean squared error: %.2f" % mean_squared_error(y_test, y_prediction))
print("Coefficient of determination: %.2f" % r2_score(y_test, y_prediction))

print(y_prediction)
print(y_test)

for i in range(len(y_prediction)):
    print(y_prediction[i] - y_test[i])

print(coeff)

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

first = [x[0] for x in x_test]
second = [x[1] for x in x_test]

ax.scatter(first, second, y_prediction, color="blue")

plt.show()


