import { Dispatch } from '../redux/store.tsx';
import { Node, ReactFlowInstance } from 'reactflow';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { processJson, processTokensFile } from '#/utils/tokenFiles.ts';
import JSZip from 'jszip';
import React from 'react';
import { createNode } from './create.ts';

type DropOptions = {
  reactFlowInstance: ReactFlowInstance;
  reactFlowWrapper: React.RefObject<HTMLDivElement>;
  stateInitializer: Record<string, any>;
  dispatch: Dispatch;
};

export const handleDrop = async (event, opts: DropOptions): Promise<Node[]> => {
  const { reactFlowInstance, reactFlowWrapper, stateInitializer, dispatch } =
    opts;

  if (!reactFlowWrapper.current) {
    return [];
  }

  const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();

  const nodes = reactFlowInstance.getNodes();

  let processed: Node[] = [];

  function process(nodeRequest, offset = { x: 0, y: 0 }) {
    const position = reactFlowInstance?.project({
      x: event.clientX - reactFlowBounds.left + (offset?.x || 0),
      y: event.clientY - reactFlowBounds.top + (offset?.y || 0),
    });

    //Couldn't determine the type
    if (!nodeRequest.type) {
      return;
    }
    if (
      nodeRequest.type == NodeTypes.INPUT &&
      nodes.some((x) => x.type == NodeTypes.INPUT)
    ) {
      alert('Only one input node allowed');
      return null;
    }

    if (
      nodeRequest.type == NodeTypes.OUTPUT &&
      nodes.some((x) => x.type == NodeTypes.OUTPUT)
    ) {
      alert('Only one output node allowed');
      return null;
    }

    return createNode({
      nodeRequest,
      position,
      stateInitializer,
      dispatch,
    });
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
                  { x: 30 * i++, y: 30 * i++ },
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
