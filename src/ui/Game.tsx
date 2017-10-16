import * as React from 'react';
import WebcamClassifier from './WebcamClassifier';
import Countdown from './Countdown';
import { IMAGE_SIZE } from '../constants';
import './styles/Game.css';

enum Outcome {
  won,
  lost,
}

export interface Props {}

export interface State {
  outcome: Outcome | undefined;
  predictedClass: string;
}

export default class Game extends React.Component<Props, State> {
  private countdown: Countdown;

  state = {
    outcome: undefined,
    predictedClass: 'keine',
  };

  componentDidMount() {
    this.play();
  }

  play = (): void => {
    this.countdown.start(this.won);
    // this.setState({ outcome: undefined });
  };

  private won = (): void => {
    this.setState({ outcome: Outcome.won });
  };

  // private lost = (): void => {
  //   this.setState({ outcome: Outcome.lost });
  // };

  private renderOutcome = (): JSX.Element | string | void => {
    const { outcome } = this.state;
    if (outcome === Outcome.won) {
      return 'You won';
    } else if (outcome === Outcome.lost) {
      return 'You lost';
    }
  };

  private handlePredict = (predictedClass: string) => {
    // this.setState({ predictedClass: predictedClass });
    // console.log(predictedClass);
  };

  render() {
    return (
      <div className="Game">
        <div className="Game-player-section">
          <WebcamClassifier onPredict={this.handlePredict} />
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
        <div>{this.renderOutcome()} </div>
        <div>{this.state.predictedClass}</div>
      </div>
    );
  }
}
