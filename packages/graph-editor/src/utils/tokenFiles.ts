import { IResolvedToken, convertW3CToStudio, flatten } from './index.js';
import json5 from 'json5';

const getFileExtension = (filename) => {
  return filename.slice(filename.lastIndexOf('.') + 1);
};

export const processJson = (pojo, isW3c) => {
  if (isW3c) {
    pojo = convertW3CToStudio(pojo);
  }

  const flattenedTokens = flatten(pojo);
  return flattenedTokens;
};

export const readFile = async (file: File): Promise<IResolvedToken[]> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    const ext = getFileExtension(file.name);
    reader.onload = (event) => {
      const raw = event.target?.result as string;
      let pojo;
      switch (ext) {
        case 'json':
          pojo = JSON.parse(raw);
          break;
        case 'json5':
          pojo = json5.parse(raw);
      }

      //Quick and dirty
      const isW3c = raw.includes('$value');
      resolve(processJson(pojo, isW3c));
    };
    reader.readAsText(file);
  });
};

export const processTokensFile = async (file: File) => {
  const name = file.name.split('.').slice(0, -1).join('.');
  const tokenData = await readFile(file);
  return {
    name,
    tokens: tokenData,
  };
};
