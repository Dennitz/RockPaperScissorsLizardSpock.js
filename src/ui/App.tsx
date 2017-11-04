import * as React from 'react';
import Game from './Game';
import Header from './Header';
import About from './About';
import Rules from './Rules';
import TrainImgCapturer from './TrainImgCapturer';
import './styles/App.css';

class App extends React.Component {
  render() {
    if (process.env.REACT_APP_TRAIN && process.env.NODE_ENV !== 'production') {
      return <TrainImgCapturer />;
    }
    return (
      <div className="App">
        <Header />
        <div className="App-game">
          <Game />
        </div>
        <div className="App-text-sections">
          <About />
          <Rules />
        </div>
        <div className="App-footer" />
      </div>
    );
  }
}

export default App;
