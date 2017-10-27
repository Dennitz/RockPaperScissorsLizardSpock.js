import * as React from 'react';
import TextSection from './TextSection';

export default function About() {
  return (
    <TextSection heading="What is this?">
      <p>
        This demo let's you play{' '}
        <a href="https://www.youtube.com/watch?v=iSHPVCBsnLw&feature=youtu.be&t=25s">
          Rock Paper Scissors Lizard Spock
        </a>{' '}
        against your browser.
      </p>
      <p>
        It uses a convolutional neural network to classify what move you are
        playing.<br /> The neural net runs right in your browser, powered by{' '}
        <a href="https://deeplearnjs.org/">deeplearn.js</a>.
      </p>
    </TextSection>
  );
}
