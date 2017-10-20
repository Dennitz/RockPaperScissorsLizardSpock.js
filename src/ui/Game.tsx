import * as React from 'react';
import WebcamClassifier from './WebcamClassifier';
import Countdown from './Countdown';
import About from './About';
import Rules from './Rules';
import { IMAGE_SIZE } from '../constants';
import { randomInt, sleep } from '../utils';
import './styles/Game.css';

// computer can not choose class other
const CLASSES_COMPUTER = [
  'lizard',
  'paper',
  'rock',
  'scissors',
  'spock',
];

export interface State {
  result: string | undefined;
  currentShownClass: string;
}

export default class Game extends React.Component<{}, State> {
  private countdown: Countdown;
  private countdownStarted: boolean;
  private currentClass: string;

  constructor() {
    super();
    this.countdownStarted = false;
    this.currentClass = 'other';
    this.state = {
      result: undefined,
      currentShownClass: 'other',
    };
  }

  play = (): void => {
    this.countdownStarted = true;
    this.countdown.start(this.evaluateGame);
  };

  private evaluateGame = async () => {
    const playerClass = this.currentClass;
    const computerClass =
      CLASSES_COMPUTER[randomInt(0, CLASSES_COMPUTER.length)];

    const result = getResult(playerClass, computerClass);
    if (result.tie) {
      this.setState({ result: "It's a tie!" });
    } else {
      const resultStr =
        result.winner.charAt(0).toUpperCase() +
        result.winner.slice(1) +
        ' ' +
        result.action +
        (result.loser && ' ' + result.loser) +
        '.';

      if (result.winner === playerClass) {
        this.setState({
          result: resultStr + 'You win!',
        });
      } else {
        this.setState({ result: resultStr + 'You lose!' });
      }
    }

    await sleep(3000);
    this.countdownStarted = false;
  };

  private handlePredict = (predictedClass: string) => {
    this.currentClass = predictedClass;
    this.setState({ currentShownClass: predictedClass });
    if (!this.countdownStarted) {
      if (predictedClass === 'rock') {
        this.play();
      }
    }
  };

  render() {
    return (
      <div className="Game">
        <div className="Game-player-section">
          <div>
            <WebcamClassifier onPredict={this.handlePredict} />
            {this.state.currentShownClass}
          </div>
          <div className="Game-spacer" />
          <div
            className="Game-computer"
            style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
          >
            <Countdown
              startAt={3}
              ref={c => (this.countdown = c as Countdown)}
            />
          </div>
        </div>
        <div>{this.state.result} </div>
        <div className="Game-text-sections">
          <About />
          <Rules />
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
    scissorcs: 'smashes',
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
