from keras.applications import inception_v3, InceptionV3, VGG19
from keras.applications import imagenet_utils
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from keras.applications.imagenet_utils import decode_predictions
import numpy as np
"""
Two classes for image extraction - 
ImageFeatureExtractor: extract image features (numpy array)
ImageClassifier: extract image keywords (list of strings)

"""


class ImageFeatureExtractor:

    def __init__(self, model='inceptionv3', resize_shape=(299, 299)):
        model_dir = {"vgg19": VGG19, "inceptionv3": InceptionV3}
        self.model = model_dir[model.lower()](include_top=False, weights='imagenet', pooling='avg')
        self.resize_shape = resize_shape
        if model in ['inceptionv3']:
            self.preprocess_input = inception_v3.preprocess_input
        else:
            self.preprocess_input = imagenet_utils.preprocess_input

    def preprocess(self, image_file):
        # load an image in PIL format
        original = load_img(image_file, target_size=self.resize_shape)  # 299, 299
        numpy_image = img_to_array(original)
        image_batch = np.expand_dims(numpy_image, axis=0)
        '''
        print('image batch size', image_batch.shape)
        plt.imshow(np.uint8(image_batch[0]))
        '''
        return self.preprocess_input(image_batch)

    def extract_features(self, image):
        features = self.model.predict(image)
        return np.ndarray.flatten(features)


class ImageClassifier:
    def __init__(self, model='inceptionv3', resize_shape=(299, 299)):
        model_dir = {"vgg19": VGG19, "inceptionv3": InceptionV3}
        self.model = model_dir[model.lower()](include_top=True, weights='imagenet', input_tensor=None, input_shape=None,
                                           pooling=None, classes=1000)
        self.resize_shape = resize_shape
        if model in ['inceptionv3']:
            self.preprocess_input = inception_v3.preprocess_input
        else:
            self.preprocess_input = imagenet_utils.preprocess_input

    def preprocess(self, image_file):
        # load an image in PIL format
        original = load_img(image_file, target_size=self.resize_shape)
        numpy_image = img_to_array(original)
        image_batch = np.expand_dims(numpy_image, axis=0)
        '''
        print('image batch size', image_batch.shape)
        plt.imshow(np.uint8(image_batch[0]))
        '''
        return self.preprocess_input(image_batch.copy())

    def extract_labels(self, image, top=3):
        prediction = self.model.predict(image)
        labels = decode_predictions(prediction, top=top)  # default top 3
        return [label[1] for label in labels[0]]
