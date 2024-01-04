import { NodeTypes } from '@tokens-studio/graph-engine';
import { processJson, processTokensFile } from '@/utils/tokenFiles.ts';
import JSZip from 'jszip';

import { NodeRequest } from './createNode';

export const handleDrop = async (event): Promise<NodeRequest[]> => {
  let processed: NodeRequest[] = [];

  function process(nodeRequest, offset = { x: 0, y: 0 }) {
    const position = {
      x: event.clientX + offset.x,
      y: event.clientY + offset.y,
    };

    return {
      ...nodeRequest,
      position,
    };
  }

  if (event.dataTransfer.files?.length > 0) {
    const fileListAsArray = Array.from(event.dataTransfer.files) as File[];
    let i = 0;
    //@ts-ignore
    processed = await Promise.all(
      fileListAsArray.map(async (file: File) => {
        switch (file.type) {
          case 'application/json': {
            const data = await processTokensFile(file);
            return process(
              {
                type: NodeTypes.INLINE_SET,
                data,
              },
              { x: 30 * i++, y: 30 * i++ },
            );
          }
          case 'application/x-zip-compressed': {
            const newZip = new JSZip();
            const zip = await newZip.loadAsync(file);
            const files = await Promise.all(
              Object.keys(zip.files).map(async (name) => {
                const raw = await zip.file(name)?.async('string');

                switch (name) {
                  case '$themes.json':
                  case '$metadata.json':
                    return null;
                  default:
                    return {
                      name,
                      tokens: processJson(JSON.parse(raw!), false),
                    };
                }
              }),
            );

            const finalFiles = files
              .filter((x) => !!x)
              .map((data) => {
                return process(
                  {
                    type: NodeTypes.INLINE_SET,
                    data,
                  },
                  { x: 10 * i++, y: 10 * i++ },
                );
              });
            return finalFiles;
          }
          default:
            alert(`Unsupported file type for import ${file.type}`);
            return null;
        }
      }),
    );
  } else {
    const dropData = event.dataTransfer.getData('application/reactflow');
    // check if the dropped element is valid
    if (typeof dropData === 'undefined' || !dropData) {
      return [];
    }
    const parsed = JSON.parse(dropData);
    //@ts-ignore
    processed = [
      //@ts-ignore
      process({
        type: parsed.type,
        data: parsed.data,
      }),
    ];
  }

  processed = processed.filter((x) => !!x).flat();
  return processed;
};
