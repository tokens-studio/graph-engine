import { Port } from '@tokens-studio/graph-engine';
import { PortInfo } from '../../services/PortRegistry.js';
import { createPortal } from 'react-dom';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';

interface PortSuggestionMenuProps {
  sourcePort: Port;
  compatiblePorts: PortInfo[];
  position: { x: number; y: number };
  onSelect: (portInfo: PortInfo) => void;
}

export const PortSuggestionMenu = observer(
  ({ compatiblePorts, position, onSelect }: PortSuggestionMenuProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelect = useCallback(
      (portInfo: PortInfo) => {
        onSelect(portInfo);
      },
      [onSelect]
    );

    if (compatiblePorts.length === 0) {
      return null;
    }

    // Filter ports based on search term
    const filteredPorts = compatiblePorts.filter(port => 
      port.portName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      port.nodeTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group ports by node type
    const groupedPorts = filteredPorts.reduce<Record<string, PortInfo[]>>(
      (acc, port) => {
        if (!acc[port.nodeTitle]) {
          acc[port.nodeTitle] = [];
        }
        acc[port.nodeTitle].push(port);
        return acc;
      },
      {}
    );

    return createPortal(
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 9999,
          background: '#1e1e1e',
          padding: '8px',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          minWidth: '300px',
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        <div style={{ padding: '8px 4px' }}>
          <input
            type="text"
            placeholder="Search ports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              background: '#333',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#fff',
              outline: 'none'
            }}
            autoFocus
          />
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {Object.entries(groupedPorts).map(([nodeTitle, ports]) => (
            <div key={nodeTitle} style={{ marginBottom: '8px' }}>
              {ports.map((portInfo) => (
                <div
                  key={`${portInfo.nodeType}-${portInfo.portName}`}
                  onClick={() => handleSelect(portInfo)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ color: '#4a9eff' }}>{portInfo.portName}</span>
                  <span style={{ color: '#666' }}> ▸ </span>
                  <span style={{ color: '#aaa' }}>{portInfo.nodeTitle}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  }
); 