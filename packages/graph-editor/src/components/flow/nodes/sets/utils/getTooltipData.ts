export const getToolTipData = (data) => {
    if (typeof data == 'object') {
      return JSON.stringify(data, null, 4);
    }
  
    return data.value;
  };