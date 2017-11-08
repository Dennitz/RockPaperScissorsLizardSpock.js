// https://github.com/tobiasahlin/SpinKit/blob/master/css/spinners/10-fading-circle.css
import * as React from 'react';
import './styles/Spinner.css';

export interface Props {
  children?: React.ReactNode;
}

const Spin = () =>
  <div className="sk-fading-circle">
    <div className="sk-circle1 sk-circle" />
    <div className="sk-circle2 sk-circle" />
    <div className="sk-circle3 sk-circle" />
    <div className="sk-circle4 sk-circle" />
    <div className="sk-circle5 sk-circle" />
    <div className="sk-circle6 sk-circle" />
    <div className="sk-circle7 sk-circle" />
    <div className="sk-circle8 sk-circle" />
    <div className="sk-circle9 sk-circle" />
    <div className="sk-circle10 sk-circle" />
    <div className="sk-circle11 sk-circle" />
    <div className="sk-circle12 sk-circle" />
  </div>;

export default function Spinner(props: Props) {
  return (
    <div className="Spinner">
      <Spin />
      {props.children}
    </div>
  );
}
