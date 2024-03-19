import { Component } from '@angular/core';

@Component({
  selector: 'app-overlay',
  template: ` <div id="mask"></div> `,
  styles: [
    `
      #mask {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: transparent;
        box-shadow: 0 5px 50px rgba(0, 0, 0, 0.5);

        backdrop-filter: blur(6px);
        opacity: 1;
        z-index: 10000;
      }

      .pulse {
        animation-name: pulse;
        animation-duration: 2s;
        animation-iteration-count: infinite;
        filter: blur(3px);
      }

      @keyframes pulse {
        0% {
          backdrop-filter: blur(10px);
        }
        50% {
          backdrop-filter: blur(15px);
        }
        100% {
          backdrop-filter: blur(10px);
        }
      }
    `,
  ],
})
export class OverlayComponent {}
