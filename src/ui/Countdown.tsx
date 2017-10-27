import * as React from 'react';
import { sleep } from '../utils';
import './styles/Countdown.css';

const COUNTDOWN_FROM = 5;
const INTERVAL = 600; // 1 second

// these words will be shown in this order, one at each step of the countdown
const CLASSES = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];

export interface State {
  countdownStarted: boolean;
  timeRemaining: number;
}

export default class Countdown extends React.Component<{}, State> {
  state = {
    countdownStarted: false,
    timeRemaining: COUNTDOWN_FROM
  };

  async start(afterCountdown: () => void) {
    this.setState({
      countdownStarted: true,
      timeRemaining: COUNTDOWN_FROM + 1
    });
    await this.countdown();
    afterCountdown();
    this.setState({countdownStarted: false});
  }

  private async countdown() {
    while (this.state.timeRemaining > 1) {
      this.setState({ timeRemaining: this.state.timeRemaining - 1 });
      await sleep(INTERVAL);
    }
  }

  render() {
    if (!this.state.countdownStarted) {
      return null;
    }
    return (
      <div className="Countdown">
        <h1>
          {this.state.timeRemaining}
        </h1>
        {CLASSES[CLASSES.length - this.state.timeRemaining]}
      </div>
    );
  }
}
