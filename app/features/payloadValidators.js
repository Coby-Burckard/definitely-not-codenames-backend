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

  // 9 is max since there's only ever 9 cards for a color
  // -1 and 0 are allowed and correspond to infinte guesses
  if (clueNumber < -1 || clueNumber > 9 || !Number.isInteger(clueNumber)) {
    return { isValid: false };
  }

  if (clueWord.toLowerCase() !== clueWord) {
    return { isValid: false };
  }

  return { isValid: true, clueWord, clueNumber };
};

module.exports = { clickCardPayload, setCluePayload };
