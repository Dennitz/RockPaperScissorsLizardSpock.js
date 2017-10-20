import * as React from 'react';
import './styles/TextSection.css';

export interface Props {
  children?: React.ReactChild | React.ReactChild[];
  heading: string;
}

export default function TextSection(props: Props) {
  const { children, heading } = props;
  return (
    <div className="TextSection">
      <h2>{heading}</h2>
      {children}
    </div>
  );
}
