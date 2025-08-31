'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BlockRenderer from './BlockRenderer';

export default function SortableBlock({ block, isSelected, isPreviewMode, onSelect }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <BlockRenderer
        block={block}
        isSelected={isSelected}
        isPreviewMode={isPreviewMode}
        onSelect={onSelect}
        dragHandleProps={listeners}
        isDragging={isDragging}
      />
    </div>
  );
}