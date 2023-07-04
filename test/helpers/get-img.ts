import path from 'path';

export const getImgFromAssets = async (imgFile: string) => {
  try {
    const filePath = path.resolve(__dirname, `assets/${imgFile}`);

    return filePath;
  } catch (error) {
    console.log(error);
  }
};
