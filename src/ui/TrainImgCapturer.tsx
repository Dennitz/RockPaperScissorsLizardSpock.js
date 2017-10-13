import * as React from 'react';
import { CATEGORIES, IMAGE_SIZE } from '../constants';
import './styles/TrainImgCapturer.css';
import CamInput from './CamInput';

export default class TrainImgCapturer extends React.Component {
  private webcamElement: HTMLVideoElement;
  private canvas: HTMLCanvasElement;

  private handleCategoryClick = (category: string) => {
    const context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    context.drawImage(this.webcamElement, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

  };

  private setCanvas = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
    this.canvas.width = IMAGE_SIZE;
    this.canvas.height = IMAGE_SIZE;
  }

  render() {
    return (
      <div className="TrainImgCapturer">
        <CamInput
          ref={(c: CamInput) => (this.webcamElement = c.getWebcamElement())}
        />
        <canvas hidden ref={this.setCanvas} />
        <div>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => this.handleCategoryClick(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>
    );
  }
}
