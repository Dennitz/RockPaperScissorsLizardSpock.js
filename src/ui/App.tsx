import * as React from 'react';
import './styles/App.css';
import Game from './Game';
import Header from './Header';
import TrainImgCapturer from './TrainImgCapturer';

class App extends React.Component {
  render() {
    if (process.env.REACT_APP_TRAIN) {
      return <TrainImgCapturer />;
    }
    return (
      <div className="App">
        <Header />
        <Game />
      </div>
    );
  }
}

export default App;
