'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import { toast } from 'react-toastify';
import axios from 'axios';

// Editor toolbar button component
const ToolbarButton = ({ icon, onClick, isActive, title }) => (
  <button
    onClick={onClick}
    className={`p-2 mx-1 rounded-md ${
      isActive ? 'bg-gray-200 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
    }`}
    title={title}
  >
    {icon}
  </button>
);

export default function LessonEditor({ lessonId, initialData }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isPublished, setIsPublished] = useState(initialData?.published || false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      CodeBlock,
    ],
    content: initialData?.content || '<p>Start writing your lesson here...</p>',
    autofocus: 'end',
  });

  // Save lesson draft
  const saveLesson = async (publish = false) => {
    if (!title) {
      toast.error('Please provide a lesson title');
      return;
    }

    if (!editor?.getHTML()) {
      toast.error('Lesson content cannot be empty');
      return;
    }

    setIsSaving(true);

    try {
      const lessonData = {
        title,
        description,
        content: editor.getHTML(),
        published: publish || isPublished,
      };

      let response;

      if (lessonId) {
        // Update existing lesson
        response = await axios.put(`/api/lessons/${lessonId}`, lessonData);
      } else {
        // Create new lesson
        response = await axios.post('/api/lessons', lessonData);
      }

      if (publish && !isPublished) {
        setIsPublished(true);
        toast.success('Lesson published successfully!');
      } else {
        toast.success('Lesson saved successfully!');
      }

      // Redirect to lesson view if creating a new lesson
      if (!lessonId && response?.data?.id) {
        router.push(`/lessons/${response.data.id}`);
      }

    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error('Failed to save lesson. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Text formatting toolbar
  const renderToolbar = () => {
    if (!editor) return null;

    return (
      <div className="border-b border-gray-200 p-2 flex flex-wrap">
        <ToolbarButton
          icon="H1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        />
        <ToolbarButton
          icon="H2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        />
        <ToolbarButton
          icon="B"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        />
        <ToolbarButton
          icon="I"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        />
        <ToolbarButton
          icon="U"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        />
        <ToolbarButton
          icon="<>"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        />
        <ToolbarButton
          icon="•"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        />
        <ToolbarButton
          icon="1."
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        />
        <ToolbarButton
          icon="Link"
          onClick={() => {
            const url = window.prompt('URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive('link')}
          title="Add Link"
        />
        <ToolbarButton
          icon="Image"
          onClick={() => {
            const url = window.prompt('Image URL:');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          title="Add Image"
        />
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Lesson Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter lesson title"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Brief description of the lesson"
        />
      </div>

      <div className="border rounded-md shadow-sm mb-6">
        {renderToolbar()}
        <EditorContent
          editor={editor}
          className="prose max-w-none p-4 min-h-[400px]"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => saveLesson(false)}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          type="button"
          onClick={() => saveLesson(true)}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSaving ? 'Publishing...' : isPublished ? 'Update Published Lesson' : 'Publish Lesson'}
        </button>
      </div>
    </div>
  );
}