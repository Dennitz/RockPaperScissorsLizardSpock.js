import * as React from 'react';
import WebcamClassifier from './WebcamClassifier';
import Countdown from './Countdown';
import { IMAGE_SIZE, CLASSES } from '../constants';
import { randomInt, sleep } from '../utils';
import './styles/Game.css';

// computer can not choose class 'other'
const CLASSES_COMPUTER = CLASSES.filter(c => c !== 'other');
// contains an icon for each class
const IMAGES = {};
CLASSES.forEach(c => (IMAGES[c] = require('./images/' + c + '.png')));

export interface State {
  result: string | undefined;
  webcamClass: string;
  computerClass: string | undefined;
}

export default class Game extends React.Component<{}, State> {
  private countdown: Countdown;
  private countdownStarted: boolean;

  constructor() {
    super();
    this.countdownStarted = false;
    this.state = {
      result: undefined,
      webcamClass: 'other',
      computerClass: undefined,
    };
  }

  play = (): void => {
    this.countdownStarted = true;
    this.countdown.start(this.evaluateGame);
  };

  private evaluateGame = async () => {
    const { webcamClass } = this.state;
    const computerClass =
      CLASSES_COMPUTER[randomInt(0, CLASSES_COMPUTER.length)];

    let resultStr: string;
    const result = getResult(webcamClass, computerClass);
    if (result.tie) {
      resultStr = "It's a tie!";
    } else {
      resultStr =
        result.winner.charAt(0).toUpperCase() +
        result.winner.slice(1) +
        ' ' +
        result.action +
        (result.loser && ' ' + result.loser) +
        '. ';

      if (result.winner === webcamClass) {
        resultStr += '\nYou win!';
      } else {
        resultStr += '\nYou lose!';
      }
    }

    this.setState({
      result: resultStr,
      computerClass,
    });

    await sleep(3000);
    this.setState({ computerClass: undefined });
    this.countdownStarted = false;
  };

  private handlePredict = (predictedClass: string) => {
    this.setState({ webcamClass: predictedClass });
    if (!this.countdownStarted) {
      if (predictedClass === 'rock') {
        this.play();
      }
    }
  };

  render() {
    const { webcamClass, computerClass, result } = this.state;
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
                src={IMAGES[webcamClass]}
                width={40}
                height={40}
                alt={webcamClass}
              />
            </div>
          </div>
          <div className="Game-spacer" />
          <div
            className="Game-computer Game-participant"
            style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
          >
            <Countdown ref={c => (this.countdown = c as Countdown)} />
            {computerClass &&
              <img
                src={IMAGES[computerClass]}
                width={96}
                height={96}
                alt={webcamClass}
              />}
          </div>
        </div>
        <div className="Game-result">
          {result}{' '}
        </div>
      </div>
    );
  }
}

const winners = {
  scissors: {
    paper: 'cuts',
    lizard: 'decapitates',
  },
  paper: {
    rock: 'covers',
    spock: 'disproves',
  },
  rock: {
    lizard: 'crushes',
    scissors: 'crushes',
  },
  lizard: {
    spock: 'poisons',
    paper: 'eats',
  },
  spock: {
    scissors: 'smashes',
    rock: 'vaporizes',
  },
  other: {},
};

type Result =
  | {
      tie: true;
    }
  | {
      winner: string;
      loser: string;
      action: string;
      tie: false;
    };

function getResult(sign1: string, sign2: string): Result {
  if (sign1 === sign2) {
    return { tie: true };
  }
  if (winners[sign1][sign2]) {
    return {
      winner: sign1,
      loser: sign2,
      action: winners[sign1][sign2] as string,
      tie: false,
    };
  } else {
    let action = winners[sign2][sign1];
    // if one sign 'other'
    if (action === undefined) {
      action = 'is better than an invalid sign';
    }
    return {
      winner: sign2,
      loser: sign1,
      action: action as string,
      tie: false,
    };
  }
}
