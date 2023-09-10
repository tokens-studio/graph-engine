import React, { useState, useMemo, useCallback } from 'react';
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
} from '@tokens-studio/ui';
import { OutputProvider } from '#/components/preview/scope.tsx';
import { TokenContextProvider } from '#/components/preview/contextExamples/lion/context.ts';
import { LiveEditor, LivePreview, LiveProvider, LiveError } from 'react-live';
import {
  TypeDefinition,
  State,
} from '@tokens-studio/graph-engine/nodes/generic/input.js';
import { scope } from '#/components/preview/scope.tsx';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  createColumnHelper,
  flexRender,
  Table,
  Column,
  Header,
  GroupingState,
  SortingState,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  getCoreRowModel,
  ColumnOrderState,
  ColumnResizeMode,
  useReactTable,
} from '@tanstack/react-table';

import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  FolderMinusIcon,
  FolderPlusIcon,
  InformationIcon,
  PauseIcon,
} from '@iconicicons/react';

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

const CheckboxGroup = ({ name, options, onCheckboxChange }) => {
  const allSelected = options.every((option) => option.selected);

  const onAllCheckboxChange = (value) => {
    options.forEach((option) => {
      onCheckboxChange(value, option.name, name);
    });
  };

  return (
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
        <Stack align="center" gap={3}>
          <Checkbox
            id={`${name}--select-all`}
            checked={allSelected}
            onCheckedChange={onAllCheckboxChange}
          />
          <Label key={`${name}--select-all`} htmlFor={`${name}--select-all`}>
            Select all
          </Label>
        </Stack>
      </Stack>
    </Box>
  );
};

type OptionValue = { name: string; selected: boolean };

type PermutationType = {
  inputValues: Record<string, string>;
  result: any;
};

const columnHelper = createColumnHelper<PermutationType>();

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[],
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string,
  );
  return [...columnOrder];
};

const DraggableColumnHeader: React.FC<{
  header: Header<PermutationType, unknown>;
  table: Table<PermutationType>;
}> = ({ header, table }) => {
  const { getState, setColumnOrder } = table;
  const state = getState();
  const { column } = header;
  const { columnOrder } = state;

  const [, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<PermutationType>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder,
      );
      setColumnOrder(newColumnOrder);
    },
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  });

  return (
    <th
      ref={dropRef}
      colSpan={header.colSpan}
      style={{ opacity: isDragging ? 0.5 : 1, width: header.getSize() }}
    >
      <div ref={previewRef}>
        <Stack align="center" justify="between" gap={4}>
          {header.isPlaceholder ? null : (
            <Stack gap={2} align="center">
              {header.column.getCanGroup() ? (
                // If the header can be grouped, let's add a toggle
                <IconButton
                  variant="invisible"
                  onClick={header.column.getToggleGroupingHandler()}
                  icon={
                    header.column.getIsGrouped() ? (
                      <FolderMinusIcon />
                    ) : (
                      <FolderPlusIcon />
                    )
                  }
                />
              ) : null}
              <Stack
                align="center"
                gap={2}
                {...{
                  className: header.column.getCanSort()
                    ? 'cursor-pointer select-none'
                    : '',
                  onClick: header.column.getToggleSortingHandler(),
                }}
              >
                <Label>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </Label>
                {{
                  asc: <ChevronUpIcon />,
                  desc: <ChevronDownIcon />,
                }[header.column.getIsSorted() as string] ?? null}
              </Stack>
            </Stack>
          )}
          <IconButton ref={dragRef} variant="invisible" icon={<PauseIcon />} />
        </Stack>
      </div>
      <div
        {...{
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className: `resizer ${
            header.column.getIsResizing() ? 'isResizing' : ''
          }`,
        }}
      />
    </th>
  );
};

function Permutate() {
  const [graph, setGraph] = useState<GraphFile | null>(null);
  const [graphInfo, setGraphInfo] = useState<DefinitionMap | null>(null);
  const [permutations, setPermutations] = useState(0);
  const [results, setResults] = useState<PermutationType[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, OptionValue[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [grouping, setGrouping] = React.useState<GroupingState>([]);

  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>('onChange');
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);

  const columns = useMemo(() => {
    if (!graphInfo) return [];

    const initial = Object.keys(graphInfo).map((key) => {
      return columnHelper.accessor((x) => x.inputValues[key], {
        id: key,
        header: () => <span>{key}</span>,
        aggregatedCell: ({ getValue }) => getValue(),
        cell: (info) => info.getValue(),
      });
    });

    setColumnOrder([...(initial.map((x) => x.id) as string[]), 'result']);
    return [
      ...initial,
      columnHelper.accessor('result', {
        header: () => <span>Preview</span>,
        enableGrouping: false,
        enableSorting: false,
        cell: (info) => (
          <OutputProvider value={info.getValue()}>
            <TokenContextProvider context={info.getValue()}>
              <LivePreview />
            </TokenContextProvider>
          </OutputProvider>
        ),
      }),
    ];
  }, [graphInfo]);

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
      setSelectedOptions((selectedOptions) => {
        const newOptions = {
          ...selectedOptions,
          [groupKey]: selectedOptions[groupKey].map((option) =>
            option.name === key ? { ...option, selected } : option,
          ),
        };
        calculatePermutations(newOptions);
        return newOptions;
      });
    },
    [calculatePermutations],
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

      const final = {
        inputValues,
        result,
      };
      setResults((results) => [...results, final]);
    }, 1);

    await Promise.all(promises);
    setLoading(false);
  }, [graph, loading, selectedOptions]);
  const table = useReactTable<PermutationType>({
    data: results,
    columns,
    columnResizeMode,
    state: {
      grouping,
      sorting,
      columnOrder,
    },
    onGroupingChange: setGrouping,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Stack
      direction="column"
      gap={2}
      css={{
        height: '100%',
        background: '$bgDefault',
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
          <Heading>Total Permutations: {permutations}</Heading>
          <Box>
            <Button onClick={onUpload}>Upload Graph</Button>
          </Box>
        </Stack>
        {graphInfo && (
          <Stack gap={4}>
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
              </Accordion>
            </Box>
          )}

          <Stack gap={3}>
            <Button onClick={onReset}>Reset</Button>
            <Button disabled={!graph} loading={loading} onClick={onPermutate}>
              Generate Permutations
            </Button>
          </Stack>
        </Box>
        <DndProvider backend={HTML5Backend}>
          {!!results.length && (
            <>
              <Heading size="medium">Results</Heading>
              <table>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <DraggableColumnHeader
                          key={header.id}
                          header={header}
                          table={table}
                        />
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          let borderColor = 'var(--colors-borderDefault)';
                          if (cell.getIsGrouped()) {
                            borderColor = 'var(--colors-successBorder)';
                          } else if (cell.getIsAggregated()) {
                            borderColor = 'var(--colors-borderSubtle)';
                          } else if (cell.getIsPlaceholder()) {
                            borderColor = 'var(--colors-borderMuted)';
                          }

                          return (
                            <td
                              {...{
                                key: cell.id,
                                style: {
                                  boxShadow: `inset 0 0 0 1px ${borderColor}`,
                                },
                              }}
                            >
                              {cell.getIsGrouped() ? (
                                // If it's a grouped cell, add an expander and row count
                                <>
                                  <Button
                                    variant="invisible"
                                    {...{
                                      onClick: row.getToggleExpandedHandler(),
                                      style: {
                                        cursor: row.getCanExpand()
                                          ? 'pointer'
                                          : 'normal',
                                      },
                                    }}
                                  >
                                    {row.getIsExpanded() ? (
                                      <ChevronDownIcon />
                                    ) : (
                                      <ChevronRightIcon />
                                    )}{' '}
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}{' '}
                                    ({row.subRows.length})
                                  </Button>
                                </>
                              ) : cell.getIsAggregated() ? (
                                // If the cell is aggregated, use the Aggregated
                                // renderer for cell
                                flexRender(
                                  cell.column.columnDef.aggregatedCell ??
                                    cell.column.columnDef.cell,
                                  cell.getContext(),
                                )
                              ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                                // Otherwise, just render the regular cell
                                flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </DndProvider>
      </LiveProvider>
    </Stack>
  );
}

export default Permutate;
