import numpy as np


class DigitRecognizerNN:

    def __init__(self):
        self.epsilon_init = 0.12
        self.num_labels = 10
        self.theta1 = None
        self.theta2 = None

    def fit(self, x, y):
        theta1 = self.get_random_weight(x.shape[1], 120)
        theta2 = self.get_random_weight(120, 10)
        vectorized_y = self.vectorize_targets(y)
        alpha = 0.03
        cost_history = []

        for i in range(500):
            cost = self.cost_function(x, vectorized_y, theta1, theta2, 1)
            cost_history.append(cost)
            theta1_grad, theta2_grad = self.get_gradients(x, vectorized_y, theta1, theta2, 1)
            theta1 = theta1 - alpha * theta1_grad
            theta2 = theta2 - alpha * theta2_grad

        self.theta1 = theta1
        self.theta2 = theta2

    def get_random_weight(self, incoming_conn, outgoing_conn):
        weight = np.random.rand(outgoing_conn, incoming_conn + 1) * 2 * self.epsilon_init - self.epsilon_init
        return weight

    def vectorize_targets(self, targets):
        m = targets.shape[0]
        eye = np.eye(self.num_labels)
        y = np.zeros((m, self.num_labels))

        for i in range(m):
            y[i, :] = eye[targets[i], :]

        return y

    def cost_function(self, x, y, theta1, theta2, lambda_):
        m = x.shape[0]
        h = self.get_predictions(x, theta1, theta2)
        penalty = (lambda_ / (2 * m)) * (np.sum(theta1[:, 1:] ** 2) + np.sum(theta2[:, 1:] ** 2))
        cost = np.sum((-y * np.log(h)) - ((1 - y) * np.log(1 - h))) / m
        cost += penalty
        return cost

    def get_predictions(self, X, theta1, theta2):
        m = X.shape[0]
        a1 = np.hstack((np.ones((m, 1)), X))
        z2 = a1 @ theta1.T
        a2 = np.c_[np.ones((z2.shape[0], 1)), self.sigmoid(z2)]
        z3 = a2 @ theta2.T
        return self.sigmoid(z3)

    def sigmoid(self, z):
        return 1 / (1 + np.exp(-z))

    def get_gradients(self, x, y, theta1, theta2, lambda_):
        m = x.shape[0]
        a1 = np.hstack((np.ones((m, 1)), x))
        z2 = a1 @ theta1.T
        a2 = np.c_[np.ones((z2.shape[0], 1)), self.sigmoid(z2)]
        z3 = a2 @ theta2.T
        h = self.sigmoid(z3)

        sigma3 = h - y
        sigma2 = (sigma3 @ theta2) * self.sigmoid_gradient(np.c_[np.ones(z2.shape[0]), z2])
        sigma2 = sigma2[:, 1:]

        delta1 = sigma2.transpose() @ a1
        delta2 = sigma3.transpose() @ a2

        theta1_grad = (delta1 / m) + (lambda_ / m) * np.c_[np.zeros(theta1.shape[0]), theta1[:, 1:]]
        theta2_grad = (delta2 / m) + (lambda_ / m) * np.c_[np.zeros(theta2.shape[0]), theta2[:, 1:]]
        return theta1_grad, theta2_grad

    def sigmoid_gradient(self, z):
        sigmoid_ = self.sigmoid(z)
        gradient = sigmoid_ * (1 - sigmoid_)
        return gradient

    def predict(self, features):
        prediction = self.get_predictions(features, self.theta1, self.theta2)
        return prediction.argmax()
