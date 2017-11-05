import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import WebcamClassifier from './WebcamClassifier';
import Countdown from './Countdown';
import Result from './Result';
import { IMAGE_SIZE, CLASSES } from '../constants';
import { randomInt, sleep } from '../utils';
import './styles/Game.css';

// computer can not choose class 'other'
const CLASSES_COMPUTER = CLASSES.filter(c => c !== 'other');
// contains an icon for each class
const IMAGES = {};
CLASSES_COMPUTER.forEach(c => (IMAGES[c] = require('./images/' + c + '.png')));
// tslint:disable-next-line
IMAGES['other'] = require('./images/other.svg');

export interface State {
  outcome: {
    webcamClass: string;
    computerClass: string;
  };
  showOutcome: boolean;
  currentWebcamClass: string;
}

export default class Game extends React.Component<{}, State> {
  private countdown: Countdown;
  private countdownStarted: boolean;

  constructor() {
    super();
    this.countdownStarted = false;
    this.state = {
      outcome: {
        webcamClass: 'other',
        computerClass: 'other',
      },
      showOutcome: false,
      currentWebcamClass: 'other',
    };
  }

  play = (): void => {
    this.setState({
      showOutcome: false,
    });
    this.countdownStarted = true;
    this.countdown.start(this.evaluateGame);
  };

  private evaluateGame = async () => {
    const { currentWebcamClass } = this.state;
    const computerClass =
      CLASSES_COMPUTER[randomInt(0, CLASSES_COMPUTER.length)];

    this.setState({
      showOutcome: true,
      outcome: {
        webcamClass: currentWebcamClass,
        computerClass,
      },
    });

    await sleep(2000);
    this.countdownStarted = false;
  };

  private handlePredict = (predictedClass: string) => {
    this.setState({ currentWebcamClass: predictedClass });
    if (!this.countdownStarted) {
      if (predictedClass === 'rock') {
        this.play();
      }
    }
  };

  render() {
    const { currentWebcamClass, outcome, showOutcome } = this.state;
    return (
      <div className="Game">
        <div className="Game-participants-section">
          <div className="Game-participant">
            <div
              className="Game-webcam"
              style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
            >
              <WebcamClassifier onPredict={this.handlePredict} />
              <img
                className="Game-webcam-class"
                src={IMAGES[currentWebcamClass]}
                width={40}
                height={40}
                alt={currentWebcamClass}
              />
            </div>
          </div>
          <div className="Game-spacer" />
          <div
            className="Game-computer Game-participant"
            style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
          >
            <Countdown ref={c => (this.countdown = c as Countdown)} />
            {showOutcome &&
              <img
                src={IMAGES[outcome.computerClass]}
                width={96}
                height={96}
                alt={outcome.computerClass}
              />}
          </div>
        </div>
        <div className="Game-result-container">
          <CSSTransition
            classNames="Game-result"
            in={showOutcome}
            timeout={80}
            mountOnEnter
            unmountOnExit
          >
            <div>
              <Result
                webcamClass={outcome.webcamClass}
                computerClass={outcome.computerClass}
              />
            </div>
          </CSSTransition>
        </div>
      </div>
    );
  }
}
