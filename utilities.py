import math
import numpy as np
from random import shuffle

"""
Utility functions
"""


def length_of(vector):
    """
     Calculate cosine similarity between two vectors. Larger value means closer distance
     :param vector: a vector in the form of an array
     :return: length in float
    """
    return math.sqrt(sum([e * e for e in vector])) # equivalent to np.linalg.norm() 2-norm


def cosine_similarity(vec_src, vec_dst):
    """
    Calculate cosine similarity between two vectors. Larger value means closer distance
    :param vec_src: source vector
    :param vec_dst: destination vector
    :return: cosine similarity in float
    """
    dot_p = np.dot(vec_src,vec_dst)
    sm = dot_p/(length_of(vec_src) * length_of(vec_dst))
    return sm


def euclidean_distance(vec_src, vec_dst):
    """
    Calculate euclidean distance between two vectors
    :param vec_src: source vector
    :param vec_dst: destination vector
    :return: euclidean distance in float
    """
    return np.linalg.norm(vec_src - vec_dst)


def sort_by_cosine_similarity(vector, pool):
    """
    Sort vectors by cosine similarity: most similar vector will be returned first
    :param vector: the source vector
    :param pool: an array of vectors to be sorted
    :return: sorted vectors
    """
    sim = [cosine_similarity(vector, x) for x in pool]
    return [(index, value) for (index, value) in sorted(enumerate(sim), key=lambda k: k[1], reverse=True)]


def random_neighbours(vector, pool):
    """
        return vectors in random order
        :param vector: the source vector
        :param pool: an array of vectors to be sorted
        :return: random vectors
        """
    vec_inc = list(range(len(pool)))
    shuffle(vec_inc)
    neighbours = []
    for index in vec_inc:
        sim = cosine_similarity(vector, pool[index])
        neighbours.append((index, sim))
    return neighbours

def moving_average(data, window_size):
    """
    Apply moving average filter to data
    :param data: input data
    :param window_size:
    :return: filtered data
    """
    ma = []
    half = int((window_size - 1) / 2)
    for n in range(len(data)):
        start = n - half
        stop = start + window_size
        if start < 0:
            start = 0
        elif stop > len(data):
            stop = len(data)

        ma.append(np.mean(data[start: stop], axis=0))
    return np.array(ma)
