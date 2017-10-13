import * as React from 'react';

export interface Props {}
export interface State {}

export default class Rules extends React.Component<Props, State> {
  render() {
    return [
      <li key="a">Scissors cuts Paper</li>,
      <li key="b">Paper covers Rock</li>,
      <li key="c">Rock crushes Lizard</li>,
      <li key="d">Lizard poisons Spock</li>,
      <li key="e">Spock smashes Scissors</li>,
      <li key="f">Scissors decapitates Lizard</li>,
      <li key="g">Lizard eats Paper</li>,
      <li key="h">Paper disproves Spock</li>,
      <li key="i">Spock vaporizes Rock</li>,
      <li key="j">(and as it always has) Rock crushes Scissors</li>,
    ];
  }
}
