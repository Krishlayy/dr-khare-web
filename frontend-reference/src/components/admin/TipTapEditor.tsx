import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3, Undo, Redo } from 'lucide-react';

export default function TipTapEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 bg-background border border-rule/50 rounded-b-lg text-foreground max-w-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col border border-rule/50 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 bg-foreground/5 p-2 border-b border-rule/50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-foreground/10 transition-colors ${editor.isActive('bold') ? 'bg-foreground/10 text-gold' : 'text-foreground/70'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-foreground/10 transition-colors ${editor.isActive('italic') ? 'bg-foreground/10 text-gold' : 'text-foreground/70'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-rule/50 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-foreground/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-foreground/10 text-gold' : 'text-foreground/70'}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-foreground/10 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-foreground/10 text-gold' : 'text-foreground/70'}`}
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-rule/50 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-foreground/10 transition-colors ${editor.isActive('bulletList') ? 'bg-foreground/10 text-gold' : 'text-foreground/70'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-foreground/10 transition-colors ${editor.isActive('orderedList') ? 'bg-foreground/10 text-gold' : 'text-foreground/70'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-foreground/10 transition-colors ${editor.isActive('blockquote') ? 'bg-foreground/10 text-gold' : 'text-foreground/70'}`}
        >
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-rule/50 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded hover:bg-foreground/10 transition-colors text-foreground/70 disabled:opacity-30"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-foreground/10 transition-colors text-foreground/70 disabled:opacity-30"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
