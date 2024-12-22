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

    console.log('Finding compatible ports for:', { sourceType, availableTypes: Array.from(this.portsByType.keys()) });

    this.portsByType.forEach((ports, typeId) => {
      ports.forEach((portInfo) => {
        if (canConvertSchemaTypes(sourceType, portInfo.portType)) {
          console.log('Found compatible port:', portInfo);
          compatiblePorts.push(portInfo);
        }
      });
    });

    return compatiblePorts;
  }
} 