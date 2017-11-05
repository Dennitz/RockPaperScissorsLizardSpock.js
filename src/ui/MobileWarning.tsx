import * as React from 'react';
import './styles/MobileWarning.css';

export interface Props {
  onAccept: () => void;
}

export default class MobileWarning extends React.Component<Props, {}> {
  private handleChange = () => {
    this.props.onAccept();
  }

  render() {
    return (
      <div className="MobileWarning">
        <div className="MobileWarning-text">
        The experience on mobile might be limited.<br /> You should try this on
        a computer.
      </div>
        <button className="MobileWarning-btn" onClick={this.handleChange}>
          OK
        </button>
      </div>
    );
  }
}
