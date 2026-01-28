function maskString(value) {
  if (!value) {
    return value;
  }

  return value
    .split(" ")
    .map(maskWord)
    .join(" ");
}

function maskWord(word) {
  if (word.length <= 2) {
    return word;
  }

  const first = word[0];
  const last = word[word.length - 1];
  const middle = word.slice(1, -1);

  const maskCount = 5;
  let masked = "";
  let index = 0;

  while (index + maskCount + 1 <= middle.length) {
    masked += "*".repeat(maskCount) + middle[index + maskCount];
    index += maskCount + 1;
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
