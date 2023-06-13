export const errorsData = (...args: string[]) => {
  const errData = {
    errorsMessages: [],
  };

  args.forEach(i =>
    errData.errorsMessages.push({
      message: expect.any(String),
      field: i,
    }),
  );

  return errData;
};
