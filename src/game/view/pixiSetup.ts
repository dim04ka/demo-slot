import { extend } from "@pixi/react";
import { Container, Graphics, Sprite } from "pixi.js";

export const setupPixi = (): void => {
  extend({
    Container,
    Graphics,
    Sprite,
  });
};
