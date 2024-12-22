import { Port } from '@tokens-studio/graph-engine';
import { PortInfo } from '../../services/PortRegistry.js';
import { createPortal } from 'react-dom';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import styles from './portSuggestionMenu.module.css';

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
        className={clsx(styles.menuContainer, 'canvas')}
        data-appearance="neutral"
        data-emphasis="minimal"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search ports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            autoFocus
          />
        </div>
        <div className={styles.portList}>
          {Object.entries(groupedPorts).map(([nodeTitle, ports]) => (
            <>
              {ports.map((portInfo) => (
                <div
                  key={`${portInfo.nodeType}-${portInfo.portName}`}
                  onClick={() => handleSelect(portInfo)}
                  className={styles.portItem}
                >
                  <span className={styles.portName}>{portInfo.portName}</span>
                  <span className={styles.separator}>▸</span>
                  <span className={styles.nodeTitle}>{portInfo.nodeTitle}</span>
                </div>
              ))}
            </>
          ))}
        </div>
      </div>,
      document.body
    );
  }
); 