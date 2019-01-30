from flask import Flask, redirect, url_for, request
from flask_cors import CORS
import os, json
import glob
import numpy as np
from vectors import Vectors


class Server:
    def __init__(self, model):
        self.word_embeddings = Vectors(model)
        self.word_embeddings.load_word_vectors(mode='fasttext')
        self.vector_size = self.word_embeddings.vector_size
        self.game = None
        self.database = None
        self.embedding_dict = None
        self.embeddings = None
        self.num_corpora = 0
        with open(os.path.join('./visualization/backend/datasource/', 'bookkeeper.json'), 'r') as f_menu:
            self.bookkeeper = json.loads(f_menu.read())
        return

    def load_game(self, game):
        self.game = game.upper().replace(' ', '_')
        database_file = self.bookkeeper[self.game]['database']
        emb_dict_file = self.bookkeeper[self.game]['embeddings']
        with open(database_file) as f_d, open(emb_dict_file) as f_e:
            self.database = json.loads(f_d.read())
            self.embedding_dict = json.loads(f_e.read())
            self.num_corpora = len(self.database.keys())
        return self.num_corpora

    def load_embeddings(self):
        if len(self.database.items()) > 0:
            img_folder = self.database['0']['screenshots']['image_folder'].replace('\\', '/')
            out_folder = os.path.dirname(os.path.dirname(img_folder))
            emb_files = sorted(glob.glob(os.path.join(out_folder, '*/embeddings_ma5/*.npy')))
            print(emb_files)
            arr_ls = []
            for file in emb_files:
                arr_ls.append(np.load(file))
            self.embeddings = np.concatenate(arr_ls, axis=0)
        return self.embeddings.shape

    def retrieve(self, input_text, top_n=10):
        vec_sen = self.word_embeddings.get_sentence_vector(input_text)
        neighbours = self.word_embeddings.find_nearest_neighbour(vec_sen, self.embeddings)
        results = []
        for idx, (nb_id, distance) in enumerate(neighbours[:top_n]):
            nb_id_str = str(nb_id)
            file_id = self.embedding_dict[nb_id_str][0]
            session_id = self.embedding_dict[nb_id_str][1]
            frame_id = self.embedding_dict[nb_id_str][2]
            corpus = self.database[file_id]['corpus']
            img_sessions = self.database[file_id]['screenshots']['image_info']
            moment_id = img_sessions[session_id]['frames'][frame_id]['moment_id']
            img_keywords = img_sessions[session_id]['frames'][frame_id]['image_keywords']
            captions = self.database[file_id]['captions']['captions'][session_id]['text']
            results.append(
                {'file_id': file_id, 'corpus': corpus, 'session_id': session_id, 'frame_id': frame_id, 'moment_id': moment_id, 'img_keywords': img_keywords, 'captions': captions})

        return results

server = Server('./visualization/backend/fasttext/wiki.en.bin')
app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return 'Embeddings loaded! Size=%d' % server.vector_size


@app.route('/hello')
def hello_world():
    return 'Hello, World! Mimi'


@app.route('/game', methods=['POST'])
def set_game():
    game = request.form.get('text')
    count = server.load_game(game)
    shape = server.load_embeddings()
    return f'{game} is loaded with [{count}] corpora, embeddings shape [{shape}]'


@app.route('/data', methods=['GET'])
def user_input():
    text = request.args.get('text')
    json_obj = json.loads(text)
    text_input = json_obj['text']
    rank = json_obj['top_n']
    results = server.retrieve(text_input, top_n = rank)
    return json.dumps(results)


if __name__ == '__main__':
    app.run(debug=False)

