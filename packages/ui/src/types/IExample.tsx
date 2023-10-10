import { GraphFile } from './file.ts';

export interface IExample {
  title: string;
  description: string;
  file: GraphFile;
  key: string;
}
