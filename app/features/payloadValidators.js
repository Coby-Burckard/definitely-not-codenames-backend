const clickCardPayload = payload => {
  const { i } = payload;
  if (typeof i !== 'number') {
    return { i: null, isValid: false };
  }

  return { i, isValid: true };
};

module.exports = { clickCardPayload };
