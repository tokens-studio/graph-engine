
import { MinimizedFlowGraph, execute, nodes } from '../../src/index.js'
import inputDisconnected from "../data/processed/inputDisconnected.json";
import noInput from "../data/processed/noInput.json";

describe('Input', () => {
    it('throws an error if no input node detected', async () => {

        await expect(async () => {
            await execute({
                graph: noInput as MinimizedFlowGraph,
                inputValues: {},
                nodes
            });
        }).rejects.toThrowError();

    });

    it('executes even if the input is disconnected', async () => {
        const result = await execute({
            graph: inputDisconnected as MinimizedFlowGraph,
            inputValues: {},
            nodes
        });

        expect(result).toEqual({ "value": "#b885a2" });
    })
}) 