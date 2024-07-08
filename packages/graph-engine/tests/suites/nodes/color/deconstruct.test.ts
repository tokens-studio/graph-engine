import { Graph } from '../../../../src/graph/graph.js';
import { expect } from 'chai';
import DestructColorNode from '../../../../src/nodes/color/deconstruct.js';

describe('color/deconstruct', () => {
  it('deconstructs an RGB color correctly', async () => {
    const graph = new Graph();
    const node = new DestructColorNode({ graph });

    node.inputs.color.setValue({
      space: 'rgb',
      channels: [255, 128, 64],
      alpha: 1
    });

    await node.execute();

    expect(node.outputs.space.value).to.equal('rgb');
    expect(node.outputs.a.value).to.equal(255);
    expect(node.outputs.b.value).to.equal(128);
    expect(node.outputs.c.value).to.equal(64);
    expect(node.outputs.alpha.value).to.equal(1);
  });

  it('deconstructs an HSL color correctly', async () => {
    const graph = new Graph();
    const node = new DestructColorNode({ graph });

    node.inputs.color.setValue({
      space: 'hsl',
      channels: [180, 0.5, 0.5],
      alpha: 0.8
    });

    await node.execute();

    expect(node.outputs.space.value).to.equal('hsl');
    expect(node.outputs.a.value).to.equal(180);
    expect(node.outputs.b.value).to.equal(0.5);
    expect(node.outputs.c.value).to.equal(0.5);
    expect(node.outputs.alpha.value).to.equal(0.8);
  });

  it('handles a color without alpha correctly', async () => {
    const graph = new Graph();
    const node = new DestructColorNode({ graph });

    node.inputs.color.setValue({
      space: 'lab',
      channels: [50, 10, -20]
    });

    await node.execute();

    expect(node.outputs.space.value).to.equal('lab');
    expect(node.outputs.a.value).to.equal(50);
    expect(node.outputs.b.value).to.equal(10);
    expect(node.outputs.c.value).to.equal(-20);
    expect(node.outputs.alpha.value).to.be.undefined;
  });

  it('throws an error for invalid color input', async () => {
    const graph = new Graph();
    const node = new DestructColorNode({ graph });
  
    node.inputs.color.setValue(null);
  
    try {
      await node.execute();
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Invalid color input');
    }
  });

  it('handles edge case with zero values', async () => {
    const graph = new Graph();
    const node = new DestructColorNode({ graph });

    node.inputs.color.setValue({
      space: 'rgb',
      channels: [0, 0, 0],
      alpha: 0
    });

    await node.execute();

    expect(node.outputs.space.value).to.equal('rgb');
    expect(node.outputs.a.value).to.equal(0);
    expect(node.outputs.b.value).to.equal(0);
    expect(node.outputs.c.value).to.equal(0);
    expect(node.outputs.alpha.value).to.equal(0);
  });
});