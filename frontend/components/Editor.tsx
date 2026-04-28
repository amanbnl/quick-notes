"use client";
import React from 'react'; // useState ki zaroorat yahan nahi hai, parent handle karega
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { cn } from '@/utils/cn';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// Destructure props: initialContent aur onChange
export default function Editor({ initialContent, onChange }) {
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <div className="group">
      <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <ReactQuill 
          theme="snow" 
          // value ko initialContent se map karo
          value={initialContent || ''} 
          // Quill ka onChange seedha parent ke onChange ko data bhej dega
          onChange={onChange} 
          modules={modules}
          placeholder="Write something legendary..."
          className="editor-content"
        />
      </div>
      
      {/* Quill ke default borders hatane ke liye styles (Optional but recommended for your minimalist UI) */}
      <style jsx global>{`
        .ql-container.ql-snow {
          border: none !important;
          font-family: inherit;
        }
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #f4f4f5 !important; /* zinc-100 */
          background: #fafafa;
        }
        .ql-editor {
          min-height: 500px;
          font-size: 16px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}