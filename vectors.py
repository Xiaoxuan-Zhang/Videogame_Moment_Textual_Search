import re
from gensim.models import KeyedVectors
from gensim.models import FastText as fasttext
from nltk.corpus import stopwords
import numpy as np
import utilities as util
# nltk.download("stopwords")


class Vectors:

    def __init__(self, filename):
        self.vector_file = filename
        self.embedding_dict = None
        self.stop_words = set(stopwords.words('english'))
        self.vector_size = 0
        return

    def load_word_vectors(self, mode='fasttext'):
        if self.embedding_dict is None:
            if mode.lower() == 'fasttext':
                print("load fasttext vec")
                self.embedding_dict = fasttext.load_fasttext_format(self.vector_file).wv
            else:
                print("load word2vec")
                self.embedding_dict = KeyedVectors.load_word2vec_format(self.vector_file)
            ''' 
            Note that Fasttext bin file is not compatible with word2vec format as it contains extra 
            information for subwords that might be useful for dealing with out-of-vocabulary words. 

            Another solution to load FastText .vec if out-of-vocabulary words are not a concern
            Step 1. load .vec file. .vec file contains texts info for all words pretrained
            self.embedding_dict = KeyedVectors.load_word2vec_format(self.vector_file, binary=False) 
            Step 2. Convert .vec file into word2vec .bin format
            self.embedding_dict.save_word2vec_format(self.vector_file + ".bin", binary=True) 
            Step 3. Load converted .bin file. 
            self.embedding_dict = KeyedVectors.load_word2vec_format(self.vector_file + ".bin", binary=True)
            '''
            self.vector_size = self.embedding_dict.vector_size
        return self.embedding_dict

    # For fasttext models only
    def get_word_vector(self, words):
        wordvec = []
        try:
            wordvec = self.embedding_dict[words]
        except Exception as ex:
            for word in words:
                match_list = self.embedding_dict.most_similar(word)
                wordvec.append([key for (key, value) in match_list][0])  # return the most similar one
        return wordvec

    def get_sentence_vector(self, sentence, in_vocabulary=True):
        word_list = self._get_word_list(sentence)
        # skip out-of-vocabulary words
        if in_vocabulary:
            keywords = [word for word in word_list if word in self.embedding_dict.vocab]
        else:
            keywords = word_list

        mean_vec = np.mean(np.array(self.get_word_vector(keywords)), axis=0) if len(keywords) > 0 else np.ones(
            self.vector_size)

        return mean_vec

    def generate_sentence_vectors(self, sentence_list):
        sentence_vec = []
        for sent in sentence_list:
            sc = self.get_sentence_vector(sent)
            sentence_vec.append(sc)
        sentence_embedding = np.array(sentence_vec)
        return sentence_embedding

    def _filter_stop_words(self, tokens):
        new_tokens = []
        for tk in tokens:
            if tk not in self.stop_words:
                new_tokens.append(tk)
        return new_tokens

    def _filter_numbers(self, tokens):
        tokens = [token for token in tokens if token.isalpha()]
        return tokens

    def _filter_punct(self, tokens):
        new_tokens = []
        for token in tokens:
            token = re.sub(r'[^\w\s]', ' ', token)
            if token:
                new_tokens.append(token)
        return new_tokens

    def _decontracted(self, text):
        # specific
        text = re.sub(r"won't", "will not", text)
        text = re.sub(r"can\'t", "can not", text)
        # general
        text = re.sub(r"n\'t", " not", text)
        text = re.sub(r"\'re", " are", text)
        text = re.sub(r"\'s", " is", text)
        text = re.sub(r"\'d", " would", text)
        text = re.sub(r"\'ll", " will", text)
        text = re.sub(r"\'t", " not", text)
        text = re.sub(r"\'ve", " have", text)
        text = re.sub(r"\'m", " am", text)
        text = re.sub(r"let\'s", "let us", text)
        return text

    def _prepare_text(self, text):
        text = text.lower()
        text = self._decontracted(text)
        return text

    def _normalize_tokens(self, tokens):
        tokens = self._filter_punct(tokens)
        tokens = self._filter_numbers(tokens)
        tokens = self._filter_stop_words(tokens)
        return tokens

    def _get_word_list(self, text):
        text = self._prepare_text(text)
        tokens = text.split(' ')
        tokens = self._normalize_tokens(tokens)
        return tokens

    def find_nearest_neighbour(self, vec_sentence, vec_pool):
        neighbours = util.sort_by_cosine_similarity(vec_sentence, vec_pool)
        return neighbours
