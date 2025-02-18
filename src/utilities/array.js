function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

const sequences = {};

function randomSequence(id, elements) {
  if ( ! sequences[id]) {
    sequences[id] = { elements: [...elements] };
  }

  let sequence = sequences[id];

  if (sequence.elements.length === elements.length) {
    /*
      Introduces a pattern in the randomness (is this really an issue?),
      but successfully prevents repetition across the boundaries of each
      run through the sequence.
    */
    return sequence.elements.splice(0, 1)[0];
  }
  else {
    let index = randomIndex(sequence.elements);
    let value = sequence.elements[index];

    sequence.elements.splice(index, 1);

    if (sequence.elements.length === 0) {
      sequence.elements = [...elements];
    }

    return value;
  }
}

export { randomElement, randomIndex, randomSequence }
