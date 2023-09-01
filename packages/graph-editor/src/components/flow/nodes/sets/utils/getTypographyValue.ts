export const getTypographyValue = (data) => {
    if (typeof data.value == 'string') {
      return data.value;
    }
    return `<Complex Typography>`;
  };