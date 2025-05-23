import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';

interface ContentEditableTextProps {
  value: string;
  placeholder: string;
  onSave: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const ContentEditableText = observer(
  ({
    value,
    placeholder,
    onSave,
    className = '',
    style = {},
    as: Component = 'div',
  }: ContentEditableTextProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const [elementRef, setElementRef] = useState<HTMLElement | null>(null);

    useEffect(() => {
      setCurrentValue(value);
    }, [value]);

    // Set initial content and update when not editing to preserve cursor position
    useEffect(() => {
      if (elementRef) {
        if (!isEditing) {
          const displayValue = currentValue || placeholder;
          if (elementRef.textContent !== displayValue) {
            elementRef.textContent = displayValue;
          }
        }
      }
    }, [elementRef, currentValue, placeholder, isEditing]);

    // Set initial content on mount
    useEffect(() => {
      if (elementRef && !isEditing) {
        const displayValue = currentValue || placeholder;
        elementRef.textContent = displayValue;
      }
    }, [elementRef]);

    const handleFocus = useCallback(() => {
      setIsEditing(true);
    }, []);

    const handleBlur = useCallback(() => {
      setIsEditing(false);
      if (currentValue !== value) {
        onSave(currentValue);
      }
    }, [currentValue, value, onSave]);

    const handleInput = useCallback((e: React.FormEvent<HTMLElement>) => {
      const newValue = e.currentTarget.textContent || '';
      setCurrentValue(newValue);
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          elementRef.current?.blur();
        }
        if (e.key === 'Escape') {
          setCurrentValue(value);
          elementRef.current?.blur();
        }
      },
      [value],
    );

    const showPlaceholder = !currentValue && !isEditing;

    return (
      <Component
        ref={elementRef as React.RefObject<HTMLElement>}
        contentEditable
        suppressContentEditableWarning
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={`${className} ${showPlaceholder ? 'placeholder' : ''}`}
        style={{
          outline: 'none',
          cursor: 'text',
          minHeight: '1.2em',
          ...style,
          ...(showPlaceholder && {
            color: 'var(--color-neutral-canvas-default-fg-muted)',
            fontStyle: 'italic',
          }),
        }}
        children={undefined}
      />
    );
  },
);
