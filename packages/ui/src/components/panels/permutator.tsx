import React, { useState, useMemo, useCallback } from 'react';
import { useGraph } from '@tokens-studio/graph-editor';
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
import { OutputProvider } from '@/components/preview/scope.tsx';
import { TokenContextProvider } from '@/components/preview/contextExamples/lion/context.ts';
import { LiveEditor, LivePreview, LiveProvider, LiveError } from 'react-live';
import { scope } from '@/components/preview/scope.tsx';
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

import { Pause, NavArrowUp, NavArrowDown, NavArrowRight, FolderPlus, FolderMinus, InfoCircleSolid } from 'iconoir-react';
import { Graph, GraphSchema, NodeTypes } from '@tokens-studio/graph-engine';
import { set } from 'mobx';

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

type GraphInputs = Record<string, {
  type: GraphSchema;
  value: any;
}>;



function getGraphInput(graph: Graph): GraphInputs | null {

  const nodes = Object.values(graph.nodes);

  const input = nodes.find((node: any) => node.nodeType() === NodeTypes.INPUT);
  const output = nodes.find((node: any) => node.nodeType() === NodeTypes.OUTPUT);


  if (!input) {
    alert(`No node of type '${NodeTypes.INPUT} found`);
    return null;
  }
  if (!output) {
    alert(`No node of type '${NodeTypes.OUTPUT} found`);
    return null;
  }

  return Object.entries(input.inputs).reduce((acc, [key, value]) => {
    acc[key] = {
      type: value.type,
      value: value.value
    }
    return acc;

  }, {});

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
                      <FolderMinus />
                    ) : (
                      <FolderPlus />
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
                  asc: <NavArrowUp />,
                  desc: <NavArrowDown />,
                }[header.column.getIsSorted() as string] ?? null}
              </Stack>
            </Stack>
          )}
          <IconButton ref={dragRef} variant="invisible" icon={<Pause />} />
        </Stack>
      </div>
      <div
        {...{
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''
            }`,
        }}
      />
    </th>
  );
};

export const PermutatorPanel = () => {

  const graph = useGraph();

  const [graphInfo, setGraphInfo] = useState<GraphInputs | null>(null);
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


  const extractInputs = () => {
    if (graph) {
      const inputs = getGraphInput(graph)
      setGraphInfo(inputs);
      if (inputs) {
        //Create the initial selected options
        const initialSelectedOptions = Object.entries(inputs).reduce(
          (acc, [key, value]) => {
            acc[key] = []
            return acc;
          },
          {},
        );
        setSelectedOptions(initialSelectedOptions);
      }

    }

  }
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
    if (loading || !graph) {
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


    const promises = inputCombinations.map(async (combination) => {
      const inputValues = combination.reduce((result, value, index) => {
        const key = Object.keys(selectedOptions)[index];
        result[key] = value;
        return result;
      }, {});

      //Create a new graph so we don't interfere with the existing graph

      const results = await graph.execute({
        inputs: inputValues,
      });


      const final = {
        inputValues,
        result: results.output,
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
        code={'TODO'}
        scope={scope}
        noInline={true}
        enableTypeScript={true}
        language="jsx"
      >
        <Stack justify="between">
          <Heading>Total Permutations: {permutations}</Heading>
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
          <Stack gap={3}>
            <Button onClick={extractInputs}>Extract inputs</Button>
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
                                      <NavArrowDown />
                                    ) : (
                                      <NavArrowRight />
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
};
