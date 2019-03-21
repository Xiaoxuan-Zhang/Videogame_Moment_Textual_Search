# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python37_render_template]
import datetime
import flask
from flask import Flask, render_template, redirect, url_for, request
from flask_cors import CORS
from server import Server
import os, json

server = Server('./visualization/backend/fasttext/wiki.en.bin') # './visualization/backend/fasttext/wiki.en.bin'
app = Flask(__name__)
CORS(app)

@app.route('/index.html')
@app.route('/')
def root():
    # For the sake of example, use static information to inflate the template.
    # This will be replaced with real information in later steps.
    dummy_times = [datetime.datetime(2018, 1, 1, 10, 0, 0),
                   datetime.datetime(2018, 1, 2, 10, 30, 0),
                   datetime.datetime(2018, 1, 3, 11, 0, 0),
                   ]
    return render_template('index.html', times=dummy_times)

@app.route('/tsnemap.html')
def tsnemap():
    # For the sake of example, use static information to inflate the template.
    # This will be replaced with real information in later steps.
    dummy_times = [datetime.datetime(2018, 1, 1, 10, 0, 0),
                   datetime.datetime(2018, 1, 2, 10, 30, 0),
                   datetime.datetime(2018, 1, 3, 11, 0, 0),
                   ]
    return render_template('tsnemap.html', times=dummy_times)

@app.route('/hello')
def hello_word():
    return f'Hello! Current number of corpora: {server.num_corpora}'

@app.route('/game', methods=['POST'])
def set_game():
    game = request.form.get('text')
    count = server.load_game(game)
    shape = server.load_embeddings()
    example_shape = server.load_example_vectors()
    print(f'{game} is loaded with [{count}] corpora, embeddings shape [{shape}], example_embeddings shape [{example_shape}]')
    response = flask.jsonify(server.example)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/data', methods=['GET'])
def user_input():
    text = request.args.get('text')
    json_obj = json.loads(text)
    text_input = json_obj['text']
    rank = json_obj['top_n']
    results = server.retrieve(text_input, top_n = rank)
    return json.dumps(results)


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='127.0.0.1', port=5000, debug=True)
# [START gae_python37_render_template]
