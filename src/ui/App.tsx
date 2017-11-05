import * as React from 'react';
import * as MobileDetect from 'mobile-detect';
import Game from './Game';
import Header from './Header';
import About from './About';
import Rules from './Rules';
import MobileWarning from './MobileWarning';
import TrainImgCapturer from './TrainImgCapturer';
import './styles/App.css';

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = Boolean(md.mobile());

export interface State {
  showMobileWarning: boolean;
}

export default class App extends React.Component<{}, State> {
  state = {
    showMobileWarning: isMobile,
  };

  private handleAccept = () => {
    this.setState({ showMobileWarning: false });
  };

  render() {
    if (process.env.REACT_APP_TRAIN && process.env.NODE_ENV !== 'production') {
      return <TrainImgCapturer />;
    }

    const { showMobileWarning } = this.state;
    const content = showMobileWarning
      ? <MobileWarning onAccept={this.handleAccept} />
      : <div>
          <div className="App-game">
            <Game />
          </div>
          <div className="App-text-sections-container">
            <div className="App-text-sections">
              <About />
              <Rules />
            </div>
          </div>
        </div>;

    return (
      <div
        className={`${showMobileWarning ? 'App-warning-container' : 'App'}`}
      >
        <Header />
        {content}
      </div>
    );
  }
}
