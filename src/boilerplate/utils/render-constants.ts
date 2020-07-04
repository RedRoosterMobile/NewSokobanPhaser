export const virtualScreen = {
  WIDTH: 800,
  HEIGHT: 600,
  ASPECT_RATIO: 800 / 600,
};

export const getWorldSize = () => {
  const worldSizeX: number = virtualScreen.WIDTH * 4;
  const worldSizeY: number = virtualScreen.HEIGHT * 4;
  return { worldSizeX, worldSizeY };
};
