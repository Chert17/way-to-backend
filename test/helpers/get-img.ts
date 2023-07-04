import fs from 'fs/promises';
import path from 'path';

export const getImgFromAssets = async (imgFile: string) => {
  try {
    const filePath = path.resolve(__dirname, `assets/${imgFile}`);

    return fs.readFile(filePath);
  } catch (error) {
    console.log(error);
  }
};
