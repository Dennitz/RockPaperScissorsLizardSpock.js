import * as React from 'react';
import TextSection from './TextSection';
import './styles/Rules.css';

const ruleParts = [
  'Scissors cuts Paper,',
  'Paper covers Rock,',
  'Rock crushes Lizard,',
  'Lizard poisons Spock,',
  'Spock smashes Scissors,',
  'Scissors decapitates Lizard,',
  'Lizard eats Paper,',
  'Paper disproves Spock,',
  'Spock vaporizes Rock,',
  'and (as it always has) Rock crushes Scissors.'
];

export default function Rules() {
  return (
    <TextSection heading="Rules">
      <div className="Rules-container">
        <ul className="Rules-list">
          {ruleParts.map(rule =>
            <li key={rule}>
              {rule}
            </li>
          )}
        </ul>
        {/* positioned behind image to make text wrap on absolute positioned
            image whithout extending flex container vertivally */}
        <div className="Rules-textwrap" />
        <img
          className="Rules-image"
          src={require('./images/rules.png')}
          alt="rules-image"
          width={240}
          height={240}
        />
      </div>
    </TextSection>
  );
}
