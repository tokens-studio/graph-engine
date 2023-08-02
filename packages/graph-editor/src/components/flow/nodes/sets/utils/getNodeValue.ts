import { getTypographyValue } from "./getTypographyValue";


export const getNodeValue = (data) => {
    switch (data.type) {
      case 'typography':
        return getTypographyValue(data);
      case 'composition':
        return 'Composition';
      case 'border':
        return 'Border';
      case 'boxShadow':
        return 'Shadow';
      default:
        return data.value;
    }
  };