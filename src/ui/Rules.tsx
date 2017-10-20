import * as React from 'react';
import TextSection from './TextSection';
import './styles/Rules.css';

const rule_parts = [
  'Scissors cuts Paper,',
  'Paper covers Rock,',
  'Rock crushes Lizard,',
  'Lizard poisons Spock,',
  'Spock smashes Scissors,',
  'Scissors decapitates Lizard,',
  'Lizard eats Paper,',
  'Paper disproves Spock,',
  'Spock vaporizes Rock,',
  'and (as it always has) Rock crushes Scissors.',
];

export default function Rules() {
  return (
    <TextSection heading="Rules">
      <div className="Rules-content">
        <ul className="Rules-list">
          {rule_parts.map(rule => <li key={rule}>{rule}</li>)}
        </ul>
        <img
          className="Rules-image"
          src={require('./rules.png')}
          alt="rules-image"
          width={256}
          height={256}
        />
      </div>
    </TextSection>
  );
}
