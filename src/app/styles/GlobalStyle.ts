import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    margin: 0;
    min-height: 100%;
  }

  body {
    background:
      radial-gradient(circle at top, #2a1438 0%, #07060d 46%);
    color: #f4efe4;
    font-family: "Trebuchet MS", "Segoe UI", sans-serif;
  }

  button,
  input {
    font: inherit;
    touch-action: manipulation;
  }

  button {
    -webkit-tap-highlight-color: transparent;
  }

  @media (orientation: landscape) and (max-height: 520px) {
    html,
    body,
    #root {
      height: 100%;
      overflow: hidden;
    }

    body {
      overscroll-behavior: none;
    }
  }

  h2,
  p {
    margin: 0;
  }

  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
`;
