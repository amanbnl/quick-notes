"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { cn } from '@/utils/cn';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function Editor() {
  const [value, setValue] = useState('');

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
    <div className=" group">
      <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <ReactQuill 
          theme="snow" 
          value={value} 
          onChange={setValue} 
          modules={modules}
          placeholder="Write something legendary..."
          className="editor-content"
        />
      </div>
    </div>
  );
}