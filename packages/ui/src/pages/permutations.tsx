import React, { useState, useEffect, useCallback } from 'react';
import {
  execute,
  nodes,
  minimizeFlowGraph,
  NodeTypes,
  FlowGraph,
} from '@tokens-studio/graph-engine';
import { GraphFile } from '#/types/file.ts';
import {
  Accordion,
  Box,
  Button,
  Checkbox,
  Heading,
  IconButton,
  Label,
  Separator,
  Stack,
  Text,
  Tooltip,
} from '@tokens-studio/ui';
import { OutputProvider } from '#/components/preview/scope.tsx';
import { TokenContextProvider } from '#/components/preview/contextExamples/lion/context.ts';
import { LiveEditor, LivePreview, LiveProvider, LiveError } from 'react-live';
import {
  TypeDefinition,
  State,
} from '@tokens-studio/graph-engine/nodes/generic/input.js';
import { scope } from '#/components/preview/scope.tsx';
import { InformationIcon } from '@iconicicons/react';

type DefinitionMap = Record<string, TypeDefinition>;

function getCombinations<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) return [[]];
  let combinations: T[][] = [];
  const [first, ...rest] = arrays;
  const subCombinations = getCombinations(rest);
  for (const item of first) {
    for (const sub of subCombinations) {
      combinations.push([item, ...sub]);
    }
  }
  return combinations;
}

function getGraphInput(graphData: GraphFile): DefinitionMap | null {
  const nodes = graphData.nodes;
  const stateData = graphData.state;

  const id = nodes.find((node: any) => node.type === NodeTypes.INPUT)?.id;

  if (id) {
    const element = stateData[id] as State;
    return element.definition;
  } else {
    alert(`No node of type '${NodeTypes.INPUT} found`);
    return null;
  }
}

const CheckboxGroup = ({ name, options, onCheckboxChange }) => (
  <Box
    css={{
      border: '1px solid $borderMuted',
      borderRadius: '$medium',
      minWidth: '300px',
      padding: '$3',
    }}
  >
    <Stack direction="column" gap={2}>
      <Heading size="medium">{name}</Heading>
      <Separator orientation="horizontal" />
      {options.map((option) => (
        <Stack align="center" gap={3}>
          <Checkbox
            id={`${name}-${option.name}`}
            checked={option.selected}
            onCheckedChange={(e) => onCheckboxChange(e, option.name, name)}
          />
          <Label key={option.name} htmlFor={`${name}-${option.name}`}>
            {option.name}
          </Label>
        </Stack>
      ))}
      <Separator orientation="horizontal" />
      {/* <Stack align='center' gap={3}>
                <Checkbox
                id={`${name}--select-all`}
                checked={option.selected}
                onCheckedChange={(e) =>    onCheckboxChange(e,option.name, name)}
            />
                <Label key={option.name}  htmlFor={option.name}>{option.name}
                </Label>
            </Stack> */}
    </Stack>
  </Box>
);

type OptionValue = { name: string; selected: boolean };

function Permutate() {
  const [permutations, setPermutations] = useState(0);
  const [results, setResults] = useState<any>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, OptionValue[]>
  >({});
  const [loading, setLoading] = useState(false);

  const [graph, setGraph] = useState<GraphFile | null>(null);
  const [graphInfo, setGraphInfo] = useState<DefinitionMap | null>(null);

  const onUpload = useCallback(() => {
    // create an input element
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', function (event) {
      //@ts-ignore
      const files = event?.target?.files;
      const file = files[0];

      // do something with the file, like reading its contents
      const reader = new FileReader();
      reader.onload = function () {
        const graph = JSON.parse(reader.result as string) as GraphFile;

        const definitions = getGraphInput(graph);

        setGraph(graph);
        setGraphInfo(definitions);

        if (!definitions) {
          return;
        }

        const initialSelectedOptions = Object.entries(definitions).reduce(
          (result, [key, definition]) => {
            //Ignore non enumerated values
            if (!definition.enum) {
              return result;
            }

            result[key] = definition.enum.map((name) => ({
              name,
              selected: false,
            }));
            return result;
          },
          {} as Record<string, OptionValue[]>,
        );

        setSelectedOptions(initialSelectedOptions);
      };
      reader.readAsText(file);
    });

    // simulate a click on the input element to trigger the file picker dialog
    input.click();
  }, []);

  const onReset = useCallback(() => {
    setResults([]);
  }, []);

  const calculatePermutations = useCallback(
    (options: Record<string, OptionValue[]>) => {
      const inputArrays = Object.values(options).map((options) =>
        options
          .filter((option: any) => option.selected)
          .map((option: any) => option.name),
      );

      const totalPermutations = inputArrays.reduce(
        (total, array) => total * array.length,
        1,
      );
      setPermutations(totalPermutations);
    },
    [],
  );

  const handleCheckboxChange = useCallback(
    (selected, key, groupKey) => {
      const newOptions = {
        ...selectedOptions,
        [groupKey]: selectedOptions[groupKey].map((option) =>
          option.name === key ? { ...option, selected } : option,
        ),
      };

      setSelectedOptions(newOptions);
      calculatePermutations(newOptions);
    },
    [calculatePermutations, selectedOptions],
  );

  const onPermutate = useCallback(async () => {
    //dont do anything if we are already loading
    if (loading) {
      return;
    }

    //Clear the existing permutations and set loading to true
    setLoading(true);
    setResults([]);

    const inputArrays = Object.values(selectedOptions).map((options) =>
      options
        .filter((option: any) => option.selected)
        .map((option: any) => option.name),
    );

    const totalPermutations = inputArrays.reduce(
      (total, array) => total * array.length,
      1,
    );
    setPermutations(totalPermutations);

    const inputCombinations = getCombinations(inputArrays);

    const minimizedGraph = minimizeFlowGraph(graph as FlowGraph);

    const promises = inputCombinations.map(async (combination) => {
      const inputValues = combination.reduce((result, value, index) => {
        const key = Object.keys(selectedOptions)[index];
        result[key] = value;
        return result;
      }, {});

      const result = await execute({
        graph: minimizedGraph,
        inputValues: inputValues,
        nodes,
      });

      setResults((results) => [...results, result]);
    });
    await Promise.all(promises);
    setLoading(false);
  }, [graph, loading, selectedOptions]);

  return (
    <Stack
      direction="column"
      gap={2}
      css={{
        height: '100%',
        background: '$bgSurface',
        padding: '$4',
        overflow: 'auto',
      }}
    >
      <LiveProvider
        code={graph?.code}
        scope={scope}
        noInline={true}
        enableTypeScript={true}
        language="jsx"
      >
        <Stack justify="between">
          <Heading style={{ paddingLeft: '2rem' }}>
            Total Permutations: {permutations}
          </Heading>
          <Box>
            <Button onClick={onUpload}>Upload Graph</Button>
          </Box>
        </Stack>
        {graphInfo && (
          <Stack gap={2}>
            {Object.keys(graphInfo).map((key) => (
              <CheckboxGroup
                key={key}
                name={key}
                options={selectedOptions[key]}
                onCheckboxChange={handleCheckboxChange}
              />
            ))}
          </Stack>
        )}
        <Box>
          {!!graph && (
            <Box>
              <Accordion type="single" collapsible>
                <Accordion.Item value="code">
                  <Stack align="center" gap={2}>
                    <Accordion.Trigger>
                      <Label>Code</Label>
                    </Accordion.Trigger>
                    <IconButton
                      tooltip="You might need to update your code if you use multiple graphs. Remember to remove references to graph names"
                      variant="ghost"
                      icon={<InformationIcon />}
                    />
                  </Stack>

                  <Accordion.Content>
                    <Box
                      css={{
                        border: '1px solid $borderMuted',
                        borderRadius: '$medium',
                        height: '400px',
                        padding: '$3',
                        overflow: 'auto',
                      }}
                    >
                      <LiveEditor />
                      <LiveError />
                    </Box>
                  </Accordion.Content>
                </Accordion.Item>

                {/* //         <Accordion.Item value={key}>
            //     <StyledAccordingTrigger>
            //       {key.charAt(0).toUpperCase() + key.slice(1)}
            //       <Separator orientation="horizontal" />
            //     </StyledAccordingTrigger>
            //     <Accordion.Content>
            //       <EntryGroup>{vals}</EntryGroup>
            //     </Accordion.Content>
            //   </Accordion.Item> */}
              </Accordion>
            </Box>
          )}

          <Stack gap={3}>
            <Button onClick={onReset}>Reset</Button>
            <Button loading={loading} onClick={onPermutate} variant="primary">
              Generate Permutations
            </Button>
          </Stack>
        </Box>
        {!!results.length && (
          <>
            <Heading size="medium">Results</Heading>
            {results.map((result, index) => (
              <OutputProvider value={result}>
                <TokenContextProvider context={result}>
                  <LivePreview />
                </TokenContextProvider>
              </OutputProvider>
            ))}
          </>
        )}
      </LiveProvider>
    </Stack>
  );
}

export default Permutate;
