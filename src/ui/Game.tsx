import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import WebcamClassifier from './WebcamClassifier';
import Countdown from './Countdown';
import Result from './Result';
import Spinner from './Spinner';
import { IMAGE_SIZE, CLASSES } from '../constants';
import { randomInt } from '../utils';
import './styles/Game.css';

// computer can not choose class 'other'
const CLASSES_COMPUTER = CLASSES.filter(c => c !== 'other');
const IMAGES = {
  rock: require('./images/rock.png'),
  paper: require('./images/paper.png'),
  scissors: require('./images/scissors.png'),
  lizard: require('./images/lizard.png'),
  spock: require('./images/spock.png'),
  other: require('./images/other.svg'),
};

export interface State {
  outcome: {
    webcamClass: string;
    computerClass: string;
  };
  showOutcome: boolean;
  showHint: boolean;
  currentWebcamClass: string;
  downloadingModel: boolean;
  webcamPermissionDenied: boolean;
  noCameraDetected: boolean;
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
      showHint: true,
      currentWebcamClass: 'other',
      downloadingModel: false,
      webcamPermissionDenied: false,
      noCameraDetected: false,
    };
  }

  play = (): void => {
    const { showHint, showOutcome } = this.state;

    if (showHint || showOutcome) {
      this.setState({
        showHint: false,
        showOutcome: false,
      });
    }
    this.countdownStarted = true;
    this.countdown.start(this.evaluateGame);
  };

  private evaluateGame = () => {
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

    this.prepareNextGame();
  };

  private prepareNextGame = async () => {
    setTimeout(() => {
      this.countdownStarted = false;
    }, 2000);
    setTimeout(() => {
      if (!this.countdownStarted) {
        this.setState({ showHint: true });
      }
    }, 6000);
  };

  private handlePredict = (predictedClass: string) => {
    if (predictedClass !== this.state.currentWebcamClass) {
      this.setState({ currentWebcamClass: predictedClass });
    }

    if (!this.countdownStarted) {
      if (predictedClass === 'rock') {
        this.play();
      }
    }
  };

  private handleClassiferReady = () => {
    this.setState({ downloadingModel: false });
  };

  private handleWebcamPermissionReceived = () => {
    this.setState({ downloadingModel: true });
  };

  private handleWebcamPermissionDenied = () => {
    this.setState({ webcamPermissionDenied: true });
  };

  private handleNoCameraDetected = () => {
    this.setState({ noCameraDetected: true });
  };

  render() {
    const {
      currentWebcamClass,
      downloadingModel,
      noCameraDetected,
      outcome,
      showHint,
      showOutcome,
      webcamPermissionDenied,
    } = this.state;
    const error = Boolean(webcamPermissionDenied || noCameraDetected);

    return (
      <div className="Game">
        {error &&
          <div className="Game-error-container">
            <div className="Game-error">
              {webcamPermissionDenied &&
                'You need to enable webcam access and reload the page.'}
              {noCameraDetected && 'You need a webcam for this demo to work.'}
            </div>
          </div>}
        <div className="Game-participants-section">
          <div className="Game-participant">
            <div
              className="Game-webcam"
              style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
            >
              <WebcamClassifier
                onPredict={this.handlePredict}
                onReady={this.handleClassiferReady}
                onPermissionReceived={this.handleWebcamPermissionReceived}
                onPermissionDenied={this.handleWebcamPermissionDenied}
                onNoCamera={this.handleNoCameraDetected}
              />
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
        <div className="Game-info-container">
          {downloadingModel && <Spinner>Loading model</Spinner>}
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
        <div className="Game-hint-container">
          <CSSTransition
            classNames="Game-hint"
            in={showHint}
            timeout={120}
            unmountOnExit
          >
            <div className="Game-hint">
              Show{' '}
              <img
                className="Game-hint-img"
                src={IMAGES.rock}
                alt="rock"
                width={32}
                height={32}
              />{' '}
              to start the game.
            </div>
          </CSSTransition>
        </div>
      </div>
    );
  }
}
