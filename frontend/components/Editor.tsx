"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { cn } from '@/utils/cn';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// 1. 'editable' prop ko yahan receive karein
export default function Editor({ initialContent, onChange, editable }) {
  
  const modules = {
    // 2. Agar editable false hai, toh toolbar hide kar dein
    toolbar: editable ? [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean'],
    ] : false,
  };

  return (
    <div className={cn("group", !editable && "read-only-mode")}>
      <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <ReactQuill 
          theme="snow" 
          value={initialContent || ''} 
          onChange={onChange} 
          modules={modules}
          // 3. 'readOnly' prop apply karein (editable ka opposite)
          readOnly={!editable}
          placeholder={editable ? "Write something legendary..." : ""}
          className="editor-content"
        />
      </div>
      
      <style jsx global>{`
        .ql-container.ql-snow {
          border: none !important;
          font-family: inherit;
        }
        /* Toolbar ko hide karne ke liye jab editable na ho */
        .read-only-mode .ql-toolbar {
          display: none !important;
        }
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #f4f4f5 !important;
          background: #fafafa;
        }
        .ql-editor {
          min-height: 500px;
          font-size: 16px;
          line-height: 1.6;
        }
        /* Read-only mode mein cursor pointer na dikhe */
        .read-only-mode .ql-editor {
          cursor: default;
        }
      `}</style>
    </div>
  );
}