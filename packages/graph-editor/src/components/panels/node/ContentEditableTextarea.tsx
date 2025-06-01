import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface ContentEditableTextareaProps {
  value: string;
  placeholder: string;
  onSave: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ContentEditableTextarea = observer(
  ({
    value,
    placeholder,
    onSave,
    className = '',
    style = {},
  }: ContentEditableTextareaProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setCurrentValue(value);
    }, [value]);

    const showPlaceholder = !currentValue && !isEditing;

    // Check if content is truncated for styling
    const fullText = currentValue || placeholder;
    const firstLine = fullText.split('\n')[0];
    const isTruncated =
      !isEditing &&
      !showPlaceholder &&
      (fullText.includes('\n') || firstLine.length > 100);

    // Set initial content and update when not editing to preserve cursor position
    useEffect(() => {
      if (elementRef.current && !isEditing) {
        const fullText = currentValue || placeholder;
        const firstLine = fullText.split('\n')[0];
        const hasMoreLines = fullText.includes('\n') || firstLine.length > 100;
        const displayValue =
          hasMoreLines && !showPlaceholder
            ? `${firstLine.slice(0, 100)}...`
            : firstLine;

        if (elementRef.current.textContent !== displayValue) {
          elementRef.current.textContent = displayValue;
        }
      }
    }, [currentValue, placeholder, isEditing, showPlaceholder]);

    const handleFocus = useCallback(() => {
      setIsEditing(true);
      // When entering edit mode, show the full content
      if (elementRef.current) {
        elementRef.current.textContent = currentValue || '';
      }
    }, [currentValue]);

    const handleBlur = useCallback(() => {
      setIsEditing(false);
      if (currentValue !== value) {
        onSave(currentValue);
      }
    }, [currentValue, value, onSave]);

    const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
      const newValue = e.currentTarget.textContent || '';
      setCurrentValue(newValue);
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          setCurrentValue(value);
          elementRef.current?.blur();
        }
      },
      [value],
    );

    return (
      <div
        ref={elementRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        title={isTruncated ? fullText : undefined}
        className={`${className} ${showPlaceholder ? 'placeholder' : ''}`}
        style={{
          outline: 'none',
          cursor: 'text',
          minHeight: isEditing ? '3em' : '1.5em',
          maxHeight: isEditing ? 'none' : '1.5em',
          overflow: isEditing ? 'auto' : 'hidden',
          padding: 'var(--component-spacing-sm)',
          border: '1px solid var(--color-neutral-border-default)',
          borderRadius: 'var(--border-radius-md)',
          backgroundColor: 'var(--color-neutral-canvas-default)',
          whiteSpace: isEditing ? 'pre-wrap' : 'nowrap',
          wordWrap: 'break-word',
          textOverflow: isEditing ? 'clip' : 'ellipsis',
          transition: 'all 0.2s ease-in-out',
          ...style,
          ...(showPlaceholder && {
            color: 'var(--color-neutral-canvas-default-fg-muted)',
            fontStyle: 'italic',
          }),
          ...(isTruncated && {
            borderColor: 'var(--color-neutral-border-subtle)',
            backgroundColor: 'var(--color-neutral-canvas-subtle)',
          }),
        }}
        children={undefined}
      />
    );
  },
);
