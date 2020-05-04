const clickCardPayload = payload => {
  const { i } = payload;
  if (typeof i !== 'number') {
    return { isValid: false };
  }

  return { i, isValid: true };
};

const setCluePayload = payload => {
  const { clueWord, clueNumber } = payload;

  if (typeof clueWord !== 'string' || typeof clueNumber !== 'number') {
    return { isValid: false };
  }

  if (clueNumber < 0 || clueNumber > 25) {
    return { isValid: false };
  }

  if (clueWord.toLowerCase() !== clueWord) {
    return { isValid: false };
  }

  return { isValid: true, clueWord, clueNumber };
};

module.exports = { clickCardPayload, setCluePayload };
