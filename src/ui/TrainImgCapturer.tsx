import * as React from 'react';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './styles/TrainImgCapturer.css';
import { CLASSES, IMAGE_SIZE } from '../constants';
import { sleep } from '../utils';
import CamInput from './CamInput';

interface ImageIds {
  rock: number;
  paper: number;
  scissors: number;
  lizard: number;
  spock: number;
  other: number;
}
export interface State {
  imageIds: ImageIds;
}

export default class TrainImgCapturer extends React.Component<{}, State> {
  private camInput: CamInput;
  private webcamElement: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private latestImageIds: ImageIds;
  private mouseDown: boolean;
  private zip: JSZip;

  constructor() {
    super();
    this.mouseDown = false;
    this.zip = new JSZip();
    /**
     * Image ids are stored twice, once in this.state for ui and 
     * once as a class property to compute file names. This is done
     * to avoid problems with the async nature of setState.
     */
    this.latestImageIds = {
      rock: 0,
      paper: 0,
      scissors: 0,
      lizard: 0,
      spock: 0,
      other: 0,
    };
    this.state = {
      imageIds: this.latestImageIds,
    };
  }

  componentDidMount() {
    this.webcamElement = this.camInput.getWebcamElement();
  }

  private handleMouseDown = async (category: string) => {
    this.mouseDown = true;
    const zipFolder = this.zip.folder(category);
    const context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    while (this.mouseDown) {
      context.drawImage(this.webcamElement, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
      const img = this.canvas.toDataURL('image/png');
      zipFolder.file(
        category + '-' + this.latestImageIds[category] + '.png',
        // see https://stackoverflow.com/questions/15287393/saving-an-image-from-canvas-in-a-zip
        img.substr(img.indexOf(',') + 1),
        {
          base64: true,
        },
      );
      this.latestImageIds[category] += 1;
      this.setState({
        imageIds: {
          ...this.state.imageIds,
          [category]: this.latestImageIds[category],
        },
      });
      await sleep(100);
    }
  };

  private handleMouseUp = () => {
    this.mouseDown = false;
  };

  private save = () => {
    this.zip.generateAsync({ type: 'blob' }).then((blob: Blob) => {
      saveAs(blob, 'train.zip');
    });
  };

  private setCanvas = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
    this.canvas.width = IMAGE_SIZE;
    this.canvas.height = IMAGE_SIZE;
  };

  private handleIdChange = (
    event: React.FormEvent<HTMLInputElement>,
    category: string,
  ) => {
    this.setState({
      imageIds: {
        ...this.state.imageIds,
        [category]: Number(event.currentTarget.value),
      },
    });
    this.latestImageIds[category] = Number(event.currentTarget.value);
  };

  render() {
    return (
      <div className="TrainImgCapturer">
        <canvas hidden ref={this.setCanvas} />
        <CamInput
          ref={c => {
            if (c) {
              this.camInput = c;
            }
          }}
        />
        <div>
          {CLASSES.map(category => (
            <div>
              <button
                key={category + 'button'}
                onMouseDown={() => this.handleMouseDown(category)}
                onMouseUp={this.handleMouseUp}
              >
                {category}
              </button>
              <input
                key={category + 'input'}
                onChange={event => this.handleIdChange(event, category)}
                value={this.state.imageIds[category]}
              />
            </div>
          ))}
        </div>
        <button onClick={this.save}>Save </button>
      </div>
    );
  }
}
