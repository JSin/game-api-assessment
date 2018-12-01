export const parseBody = (body: string) => {
  if (!body) {
    throw new Error();
  }
  let result;
  try {
    result = JSON.parse(body);
  } catch (e) {
    throw new Error();
  }
  return result;
};
