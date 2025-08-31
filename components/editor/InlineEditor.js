'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline,
  Link,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Undo,
  Redo
} from "lucide-react";

export default function InlineEditor({ 
  value, 
  onChange, 
  onBlur,
  placeholder = "Click to edit...",
  className = "",
  multiline = true,
  maxLength,
  showToolbar = true,
  tagName = "div"
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [selection, setSelection] = useState(null);
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus();
      
      // Restore selection if it exists
      if (selection) {
        const range = document.createRange();
        const sel = window.getSelection();
        try {
          range.setStart(selection.startContainer, selection.startOffset);
          range.setEnd(selection.endContainer, selection.endOffset);
          sel.removeAllRanges();
          sel.addRange(range);
        } catch (e) {
          // If selection restoration fails, just focus
          editorRef.current.focus();
        }
      }
    }
  }, [isEditing, selection]);

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleBlur = (e) => {
    // Don't blur if clicking on toolbar
    if (toolbarRef.current && toolbarRef.current.contains(e.relatedTarget)) {
      return;
    }

    const content = editorRef.current.textContent || editorRef.current.innerText;
    setIsEditing(false);
    setShowFormatting(false);
    
    if (onBlur) {
      onBlur(content);
    } else if (onChange) {
      onChange(content);
    }
  };

  const handleInput = (e) => {
    const content = e.target.textContent || e.target.innerText;
    
    // Check max length
    if (maxLength && content.length > maxLength) {
      e.target.textContent = content.slice(0, maxLength);
      return;
    }

    if (onChange) {
      onChange(content);
    }
  };

  const handleKeyDown = (e) => {
    // Handle Enter key
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      editorRef.current.blur();
      return;
    }

    // Handle Escape key
    if (e.key === 'Escape') {
      editorRef.current.blur();
      return;
    }

    // Show formatting toolbar on text selection
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      setTimeout(() => {
        const sel = window.getSelection();
        if (sel.toString().length > 0) {
          setShowFormatting(true);
          setSelection({
            startContainer: sel.getRangeAt(0).startContainer,
            startOffset: sel.getRangeAt(0).startOffset,
            endContainer: sel.getRangeAt(0).endContainer,
            endOffset: sel.getRangeAt(0).endOffset
          });
        } else {
          setShowFormatting(false);
        }
      }, 0);
    }
  };

  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (sel.toString().length > 0 && showToolbar) {
      setShowFormatting(true);
      setSelection({
        startContainer: sel.getRangeAt(0).startContainer,
        startOffset: sel.getRangeAt(0).startOffset,
        endContainer: sel.getRangeAt(0).endContainer,
        endOffset: sel.getRangeAt(0).endOffset
      });
    } else {
      setShowFormatting(false);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    
    // Update content after formatting
    const content = editorRef.current.textContent || editorRef.current.innerText;
    if (onChange) {
      onChange(content);
    }
  };

  const handleFormat = (command, value = null) => {
    execCommand(command, value);
  };

  const Component = tagName;

  return (
    <div className="relative inline-block w-full">
      <Component
        ref={editorRef}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        className={`
          ${className}
          ${isEditing 
            ? 'border-2 border-blue-500 bg-white outline-none rounded px-2 py-1' 
            : 'cursor-pointer hover:bg-blue-50 hover:ring-1 hover:ring-blue-200 rounded px-2 py-1 transition-colors'
          }
          ${!value && !isEditing ? 'text-gray-400' : ''}
        `}
        onClick={handleClick}
        onBlur={handleBlur}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={handleMouseUp}
        role="textbox"
        aria-label={placeholder}
        data-placeholder={placeholder}
      >
        {value || (!isEditing && placeholder)}
      </Component>

      {/* Formatting Toolbar */}
      {isEditing && showFormatting && showToolbar && (
        <div 
          ref={toolbarRef}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-1 z-50"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleFormat('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleFormat('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleFormat('underline')}
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-3 w-3" />
          </Button>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleFormat('justifyLeft')}
            title="Align Left"
          >
            <AlignLeft className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleFormat('justifyCenter')}
            title="Align Center"
          >
            <AlignCenter className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleFormat('justifyRight')}
            title="Align Right"
          >
            <AlignRight className="h-3 w-3" />
          </Button>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => {
              const url = prompt('Enter link URL:');
              if (url) handleFormat('createLink', url);
            }}
            title="Add Link"
          >
            <Link className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleFormat('removeFormat')}
            title="Clear Formatting"
          >
            <Type className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Character Counter */}
      {isEditing && maxLength && (
        <div className="absolute bottom-0 right-0 transform translate-y-full pt-1">
          <span className={`text-xs ${
            (value?.length || 0) > maxLength * 0.9 ? 'text-red-500' : 'text-gray-400'
          }`}>
            {value?.length || 0}/{maxLength}
          </span>
        </div>
      )}

      {/* Editing Instructions */}
      {isEditing && (
        <div className="absolute bottom-0 left-0 transform translate-y-full pt-1">
          <span className="text-xs text-gray-400">
            {multiline ? 'Enter to add line • Esc to finish' : 'Enter or Esc to finish'}
          </span>
        </div>
      )}
    </div>
  );
}