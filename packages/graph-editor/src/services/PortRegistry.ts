import { Graph, Node, Port, SchemaObject, canConvertSchemaTypes } from '@tokens-studio/graph-engine';

export interface PortInfo {
  portName: string;
  nodeType: string;
  nodeTitle: string;
  portType: SchemaObject;
}

export class PortRegistry {
  private nodeTypes: Record<string, typeof Node>;
  private portsByType: Map<string, PortInfo[]> = new Map();
  private graph: Graph;

  constructor(nodeTypes: Record<string, typeof Node>) {
    this.nodeTypes = nodeTypes;
    this.graph = new Graph();
    this.graph.capabilities = new Map();
    this.buildPortIndex();
  }

  private buildPortIndex() {
    Object.entries(this.nodeTypes).forEach(([nodeType, NodeClass]) => {
      try {
        const tempNode = new NodeClass({ graph: this.graph });
        const nodeTitle = tempNode.factory.title || nodeType;

        Object.entries(tempNode.inputs).forEach(([portName, port]) => {
          if (!port.variadic) {
            this.indexPort(portName, nodeType, nodeTitle, port);
          }
        });
      } catch (error) {
        console.warn(`Failed to index node type: ${nodeType}`, error);
      }
    });
  }

  private indexPort(portName: string, nodeType: string, nodeTitle: string, port: Port) {
    const portType = port.type;
    const portInfo: PortInfo = {
      portName,
      nodeType,
      nodeTitle,
      portType
    };

    console.log('Indexing port:', { portInfo, portType });

    if (portType.$id) {
      const existing = this.portsByType.get(portType.$id) || [];
      this.portsByType.set(portType.$id, [...existing, portInfo]);
    }

    if (portType.type === 'array' && portType.items.$id) {
      const existing = this.portsByType.get(portType.items.$id) || [];
      this.portsByType.set(portType.items.$id, [...existing, portInfo]);
    }
  }

  public findCompatiblePorts(sourcePort: Port): PortInfo[] {
    const sourceType = sourcePort.type;
    const compatiblePorts: PortInfo[] = [];

    // Get the type ID we want to match
    const typeId = sourceType.$id;
    if (!typeId) {
      // For arrays, check the item type
      if (sourceType.type === 'array' && sourceType.items.$id) {
        const arrayPorts = this.portsByType.get(sourceType.items.$id) || [];
        compatiblePorts.push(...arrayPorts);
      }
      return compatiblePorts;
    }

    // Get ports that match our exact type
    const matchingPorts = this.portsByType.get(typeId) || [];
    compatiblePorts.push(...matchingPorts);

    return compatiblePorts;
  }
} 