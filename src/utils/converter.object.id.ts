import mongoose from 'mongoose';

export const tryConvertToObjectId = (
  id: string,
): mongoose.Types.ObjectId | null => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (e) {
    return null;
  }
};
