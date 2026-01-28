function maskString(value, maskCount) {
  if (!value) {
    return value;
  }

  return value
    .split(" ")
    .map((word) => maskWord(word, maskCount))
    .join(" ");
}

function maskWord(word, maskCount) {
  if (word.length <= 2) {
    return word;
  }

  const first = word[0];
  const last = word[word.length - 1];
  const middle = word.slice(1, -1);

  const normalizedMaskCount = maskCount ? maskCount : 5;
  if (normalizedMaskCount <= 0) {
    return word;
  }
  let masked = "";
  let index = 0;

  while (index + normalizedMaskCount + 1 <= middle.length) {
    masked += "*".repeat(normalizedMaskCount) + middle[index + normalizedMaskCount];
    index += normalizedMaskCount + 1;
  }

  const remainder = middle.length - index;
  if (remainder > 0) {
    masked += "*".repeat(remainder);
  }

  return first + masked + last;
}



module.exports = {
  maskString
};
