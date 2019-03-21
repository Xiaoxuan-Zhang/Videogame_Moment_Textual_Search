# Videogame_Moment_Textual_Search

This project is an extension to [Videogame Moment Space](https://github.com/Xiaoxuan-Zhang/Videogame_Moment_Visualization). Its purpose is to add textual search for retrieving semantically relevant game moments, which is specifically applied to narrative-centered videogames with a large body of dialogues and conversations. The premise is that given a user inquiry in forms of sentences, words, and phrases describing a scene, this system should be able to find relevant moments using semantic search. For the sake of simplicity, we take advantage of those playthrough videos with auto-CC (closed captions) enabled, uploaded online by random players. Because closed captions are already aligned with the video, we can easily sampled the data needed in this experiment.

Dialogues are first sampled from closed captions downloaded along with YouTube videos. Image keywords are extracted from captured screenshots using pretrained models. All textual data is then embedded into a vector space using pretrained fastText model such that it is possible to find the closest neighbours given a target vector by calculating the cosine similarity. 

To view the live demo, visit [here](https://videogamemomentspace.appspot.com/).

## 1. Getting Started
To run this experiment, we need to get a bunch of libraries installed.
Here is a list of prerequisites:

* [Jupyter Notebook](http://jupyter.org/)
* Python 3
  * Python 3 libraries
    * [Scipy](https://www.scipy.org/) 0.19.1
    * [scikit-learn](http://scikit-learn.org/stable/) 0.19.1
    * [Keras](https://keras.io/) 2.2.4
    * [TensorFlow](https://keras.io/) 1.12.0
    * [gensim](https://radimrehurek.com/gensim/) 3.6.0
    * [fastText](https://fasttext.cc/)
    * [opencv-python](https://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_tutorials.html) 3.4.4.19
    * [pytesseract](https://pypi.org/project/pytesseract/) 0.2.5
* Pretrained model
  * [Wiki word vectors](https://s3-us-west-1.amazonaws.com/fasttext-vectors/wiki.en.zip)
    
## 2. Setup a working directory
Clone or Download the code to a local folder, and this folder will be the root path for this experiment.
In this folder, you will find the following notebooks along with some python files:
  * step1_captures_and_captions.ipynb<br>
  * step2_extract_image_labels.ipynb<br>
  * step3_vector_embeddings.ipynb<br>
  * step4_evaluation.ipynb<br>
  * step5_image_feature_extractor.ipynb<br>
  * step6_extract_key_content.ipynb<br>

Each notebook provides instructions about why-and-how. The other python files contain some classes and utility functions used in those notebooks.

## 3. Prepare data
Make each video and its corresponding caption file have the same name. It is necessary in the sampling process because the code will need this information to match videos with correct caption files. An example should be:
* Episode_1.mp4 - video<br>
* Episode_1.vtt - caption<br>
* Episode_2.mp4 - video<br>
* Episode_2.vtt - caption<br>

## 4. Process data
Run each notebook following the correct order denoted in the filename.


## Citations
@article{bojanowski2017enriching,
  title={Enriching Word Vectors with Subword Information},
  author={Bojanowski, Piotr and Grave, Edouard and Joulin, Armand and Mikolov, Tomas},
  journal={Transactions of the Association for Computational Linguistics},
  volume={5},
  year={2017},
  issn={2307-387X},
  pages={135--146}
}

@article{Szegedy2016RethinkingTI,
  title={Rethinking the Inception Architecture for Computer Vision},
  author={Christian Szegedy and Vincent Vanhoucke and Sergey Ioffe and Jonathon Shlens and Zbigniew Wojna},
  journal={2016 IEEE Conference on Computer Vision and Pattern Recognition (CVPR)},
  year={2016},
  pages={2818-2826}
}
