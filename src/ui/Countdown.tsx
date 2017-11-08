import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import { sleep } from '../utils';
import './styles/Countdown.css';

/** time between steps */
const STEP_TIMEOUT = 800;
const COUNTDOWN_FROM = 5;

const FADE_DURATION = 110;
const SLIDE_DURATION = 110;

// these words will be shown in this order, one at each step of the countdown
const CLASSES = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];

export interface State {
  countdownStarted: boolean;
  timeRemaining: number;
  /** 
   * Fade in animation for text will begin when set to true, 
   * fade out when set to false
   */
  startFade: boolean;
  startSlide: boolean;
}

interface TransitionProps {
  children: React.ReactNode;
  name: string;
  startTransition: boolean;
  timeout: number;
}

function Transition(props: TransitionProps): JSX.Element {
  const { children, name, startTransition, timeout } = props;

  return (
    <CSSTransition classNames={name} in={startTransition} timeout={timeout}>
      <div>
        {children}
      </div>
    </CSSTransition>
  );
}

export default class Countdown extends React.Component<{}, State> {
  state = {
    countdownStarted: false,
    timeRemaining: COUNTDOWN_FROM,
    startFade: false,
    startSlide: false,
  };

  async start(afterCountdown: () => void) {
    this.setState({
      countdownStarted: true,
      timeRemaining: COUNTDOWN_FROM + 1,
    });
    await this.countdown();
    afterCountdown();
    this.setState({ countdownStarted: false });
  }

  private async countdown() {
    while (this.state.timeRemaining > 1) {
      this.setState({
        timeRemaining: this.state.timeRemaining - 1,
        startFade: true,
        startSlide: true,
      });

      setTimeout(
        () => this.setState({ startFade: false }),
        STEP_TIMEOUT - FADE_DURATION,
      );
      setTimeout(
        () => this.setState({ startSlide: false }),
        STEP_TIMEOUT - SLIDE_DURATION,
      );
      await sleep(STEP_TIMEOUT);
    }
  }

  render() {
    const {
      countdownStarted,
      timeRemaining,
      startFade,
      startSlide,
    } = this.state;
    if (!countdownStarted) {
      return null;
    }
    return (
      <div className="Countdown">
        <Transition
          name="Countdown-slide"
          startTransition={startSlide}
          timeout={SLIDE_DURATION}
        >
          <Transition
            name="Countdown-fade"
            startTransition={startFade}
            timeout={FADE_DURATION}
          >
            <h1>
              {timeRemaining}
            </h1>
          </Transition>
        </Transition>
        <Transition
          name="Countdown-fade"
          startTransition={startFade}
          timeout={FADE_DURATION}
        >
          {CLASSES[CLASSES.length - timeRemaining]}
        </Transition>
      </div>
    );
  }
}
