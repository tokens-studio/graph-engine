import { Port } from '@tokens-studio/graph-engine';
import { PortInfo } from '../../services/PortRegistry.js';
import { createPortal } from 'react-dom';
import { extractTypeIcon } from './wrapper/nodeV2.js';
import { icons } from '../../redux/selectors/registry.js';
import { observer } from 'mobx-react-lite';
import { useAction } from '../../editor/actions/provider.js';
import { useSelector } from 'react-redux';
import React, { useCallback } from 'react';
import styles from './portSuggestionMenu.module.css';

interface PortSuggestionMenuProps {
  sourcePort: Port;
  compatiblePorts: PortInfo[];
  position: { x: number; y: number };
  onSelect: (portInfo: PortInfo) => void;
}

export const PortSuggestionMenu = observer(
  ({ sourcePort, compatiblePorts, position, onSelect }: PortSuggestionMenuProps) => {
    console.log('PortSuggestionMenu render attempt:', { 
      sourcePort, 
      compatiblePortsCount: compatiblePorts.length,
      position 
    });

    const iconTypeRegistry = useSelector(icons);
    const createNode = useAction('createNode');

    const handleSelect = useCallback(
      (portInfo: PortInfo) => {
        console.log('Port selected:', portInfo);
        // Create the node
        const result = createNode({
          type: portInfo.nodeType,
          position: position,
        });

        if (result) {
          onSelect(portInfo);
        }
      },
      [createNode, onSelect, position]
    );

    if (compatiblePorts.length === 0) {
      console.log('No compatible ports, not rendering menu');
      return null;
    }

    // Group ports by node type
    const groupedPorts = compatiblePorts.reduce<Record<string, PortInfo[]>>((acc, port) => {
      if (!acc[port.nodeTitle]) {
        acc[port.nodeTitle] = [];
      }
      acc[port.nodeTitle].push(port);
      return acc;
    }, {});

    console.log('Rendering menu with groups:', Object.keys(groupedPorts));

    // Create a more visible test menu first
    return createPortal(
      <div
        style={{ 
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 9999,
          background: 'white',
          padding: '20px',
          border: '2px solid red',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          minWidth: '200px'
        }}
      >
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
          Compatible Ports ({compatiblePorts.length})
        </div>
        {Object.entries(groupedPorts).map(([nodeTitle, ports]) => (
          <div key={nodeTitle} style={{ marginBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', color: '#666' }}>{nodeTitle}</div>
            {ports.map((portInfo) => (
              <div
                key={`${portInfo.nodeType}-${portInfo.portName}`}
                onClick={() => handleSelect(portInfo)}
                style={{
                  padding: '8px',
                  margin: '4px 0',
                  cursor: 'pointer',
                  background: '#f5f5f5',
                  borderRadius: '4px'
                }}
              >
                {portInfo.portName}
              </div>
            ))}
          </div>
        ))}
      </div>,
      document.body
    );
  }
); 