import * as React from 'react';
import './styles/Result.css';

export interface Props {
  webcamClass: string;
  computerClass: string;
}

export default function Result(props: Props) {
  const { webcamClass, computerClass } = props;
  const outcome = getOutcome(webcamClass, computerClass);
  const representation = getRepresentation(outcome);
  return (
    <div className="Result">
      {representation}
      <br />
      {!outcome.tie &&
        (outcome.winner === webcamClass ? 'You win!' : 'You lose!')}
    </div>
  );
}

// each key wins against each of its subkeys, e.g scissors wins against
// paper (by cutting it) and lizard (by decapitating it)
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

type Outcome =
  | {
      tie: true;
    }
  | {
      winner: string;
      loser: string;
      action: string;
      tie: false;
    };

function getOutcome(webcamClass: string, computerClass: string): Outcome {
  if (webcamClass === computerClass) {
    return { tie: true };
  }
  if (winners[webcamClass][computerClass]) {
    return {
      winner: webcamClass,
      loser: computerClass,
      action: winners[webcamClass][computerClass] as string,
      tie: false,
    };
  } else {
    let action = winners[computerClass][webcamClass];
    let loser;
    // if one sign is 'other'
    if (action === undefined) {
      action = 'beats';
      loser = '?';
    }
    return {
      winner: computerClass,
      loser: loser || webcamClass,
      action: action as string,
      tie: false,
    };
  }
}

function getRepresentation(result: Outcome) {
  if (result.tie) {
    return "It's a tie!";
  } else {
    return (
      result.winner.charAt(0).toUpperCase() +
      result.winner.slice(1) +
      ' ' +
      result.action +
      (result.loser && ' ' + result.loser) +
      '. '
    );
  }
}
