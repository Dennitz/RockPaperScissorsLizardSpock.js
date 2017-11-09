# RockPaperScissorsPaperSpock.js

Play [Rock Paper Scissors Lizard Spock](https://www.youtube.com/watch?v=iSHPVCBsnLw&feature=youtu.be&t=25s) against your browser.

By using a convolutional neural network, this demo can regonize which move is played. The neural network runs right in a browser, powered by [deeplearn.js](https://github.com/PAIR-code/deeplearnjs).

[Demo](https://rpslsjs.herokuapp.com/)

## What's used?
- [deeplearn.js](https://github.com/PAIR-code/deeplearnjs) to run a neural net in a browser.
- [TypeScript](https://github.com/Microsoft/TypeScript) with [React](https://github.com/facebook/react) for the UI.
- [Keras](https://github.com/fchollet/keras) with [keras-squeezenet](https://github.com/rcmalli/keras-squeezenet) to train the model.

## Development
### Work on the demo

```
yarn start
```

### Take images for training

```
yarn train
```
This allows you to take images for training and save them in a folder per category.  

If you do this multiple times (with page reloads) there will be conflicting names. To solve this use `model-training/merge-dirs.py`.  

E.g. if you have the folders `train1` and `train2` each containing a folder per category, you can do: 
```
python merge-dirs.py train2 train1
``` 
This will move all files from `train2` to `train1` and resolve naming conflicts.

After this you can delete `train2` (which by now should not contain any files):
```
rm -rf train2
```

### Train the model

The jupyter notebook `model-training/rock-paper-scissors-lizard-spock.ipynb` walks you through the process of training the neural net using keras. It also shows how to save the model for use with deeplearn.js. 

The resulting weights can be downloaded [here](https://github.com/Dennitz/usercontent/files/1457961/keras-weights.hdf5.zip).

To run the notebook you need:
- Python 3
- numpy
- Jupyter
- Keras
- [keras-squeezenet](https://github.com/rcmalli/keras-squeezenet)
- Tensorflow


## License

MIT
