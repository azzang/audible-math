export const scales = (() => {
  const result = [];

  function populate(scale, mask, length, indices) {
    if (mask === 0) {
      return (result[indices[length]++] = scale);
    }
    populate(scale | mask, mask >> 1, length + 1, indices);
    populate(scale, mask >> 1, length, indices);
  }

  populate(2048, 1024, 1, {
    1: 0,
    2: 1,
    3: 12,
    4: 67,
    5: 232,
    6: 562,
    7: 1024,
    8: 1486,
    9: 1816,
    10: 1981,
    11: 2036,
    12: 2047,
  });

  return result;
})();

export const intervals = "P1 m2 M2 m3 M3 P4 A4 P5 m6 M6 m7 M7".split(" ");
