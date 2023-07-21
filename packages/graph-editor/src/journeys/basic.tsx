import React from 'react';
import { Text } from '@tokens-studio/ui';
import { Step } from 'react-joyride';
import { useSetState } from 'react-use';

interface State {
  run: boolean;
  steps: Step[];
}

export const useJourney = (): [
  State,
  (patch: Partial<State> | ((prevState: State) => Partial<State>)) => void,
] => {
  const [vals, setState] = useSetState<State>({
    run: true,
    steps: [
      {
        content: (
          <>
            <Text>Welcome to Tokens Studio&apos;s Graph Editor!</Text>
            <Text>This is a small tour to help you get started.</Text>
            <br />
            <Text>
              <b>Please note that this is an early ALPHA</b> and is not
              indicative of the final experience
            </Text>
          </>
        ),
        placement: 'center',
        target: 'body',
        title: 'Generators and resolvers',
      },
      {
        content: (
          <>
            <Text>This is your graph editor.</Text>
            <Text>
              You can drag and drop nodes to create your graph. You can drop
              tokens files directly on the graph to load them in
            </Text>
          </>
        ),
        placement: 'bottom',
        styles: {
          options: {
            width: 300,
          },
        },
        target: '.editor',
        title: 'Graph Editor',
      },
      {
        content: (
          <>
            <Text>Here are all the nodes you can add to the graph</Text>
            <Text>You can drag and drop them anywhere on the graph</Text>
          </>
        ),
        placement: 'right',
        target: '#drop-panel',
        title: 'Drop panel',
      },
      {
        content: (
          <>
            <Text>This is your code editor.</Text>
            <Text>
              You can use this to setup an example preview of how your graph
              would work on a live component
            </Text>
          </>
        ),
        placement: 'top',
        target: '#code-editor',
        title: 'Code Editor',
      },
      {
        content: (
          <>
            <Text>This is a live preview of your graph editor.</Text>
            <Text>
              As you adjust both the code and the graph, you will see the
              changes reflected here.
            </Text>
          </>
        ),
        floaterProps: {
          disableAnimation: false,
        },
        title: 'Preview Area',
        target: '#preview',
      },
      {
        content: (
          <>
            <Text>This is the toolbar</Text>
            <Text>You can save or load your graph as a JSON file.</Text>
          </>
        ),
        placement: 'bottom',
        title: 'Toolbar',
        target: '#toolbar',
      },
      {
        content: (
          <>
            <Text>
              If you need any more help,please check out the documentation here.
            </Text>
          </>
        ),
        placement: 'bottom',
        title: 'Documentation',
        target: '#more-help',
      },
    ],
  });
  const { run, steps } = vals;

  return [{ run, steps }, setState];
};
