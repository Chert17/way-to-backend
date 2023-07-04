import fs from 'fs/promises';
import path from 'path';

export const getImgFromAssets = async () => {
  const filePath = path.resolve(__dirname, 'test/helpers/assets/pandadis.jpg');
  return fs.readFile(filePath, 'utf-8');
};
