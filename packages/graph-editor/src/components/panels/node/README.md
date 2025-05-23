# Unified Node Panel

This directory contains the implementation of the unified Node Panel that consolidates the previously separate Node Settings, Input, and Output panels into a single comprehensive view.

## Components

### NodePanel (`index.tsx`)

The main unified panel component that displays:

- **Top Section**: Editable title and description using contentEditable
- **Middle Section**: Output ports and their values
- **Bottom Section**: Node information (ID, type, annotations) and input controls

### ContentEditableText (`ContentEditableText.tsx`)

A reusable contentEditable component for inline text editing:

- Supports different HTML elements (div, h1, h2, etc.)
- Handles focus/blur events for immediate saving
- Shows placeholder text when empty
- Supports keyboard shortcuts (Enter to save, Escape to cancel)

### ContentEditableTextarea (`ContentEditableTextarea.tsx`)

A reusable contentEditable component for multi-line text editing:

- Similar to ContentEditableText but optimized for longer text
- Preserves line breaks and formatting
- Styled to look like a textarea

## Features

### Inline Editing

- Title and description are always editable without requiring a separate edit mode
- Changes are saved immediately on blur
- Placeholder text is shown from the node factory when fields are empty

### Comprehensive View

- All node information is displayed in a logical top-to-bottom flow
- Preserves all functionality from the original separate panels
- Updates correctly when different nodes are selected

### Layout Integration

- Replaces the separate `input` and `outputs` tabs with a single `nodePanel` tab
- Configured in both `layoutController.tsx` and `layout.ts`
- Added to `layoutButtons.tsx` for toolbar integration

## Usage

The NodePanel automatically displays when a node is selected and shows:

1. **Node Title** (editable) - from `ui.title` annotation or factory title
2. **Node Description** (editable) - from `ui.description` annotation or factory description
3. **Output Ports** - read-only display of all output ports and their values
4. **Node Information** - ID, type, and other annotations
5. **Input Controls** - dynamic inputs, specific inputs, and input ports

When no node is selected, it shows a helpful message to select a node.
