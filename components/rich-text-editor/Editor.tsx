"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "./Menu-Bar";
import TextAlign from "@tiptap/extension-text-align";

// Custom interface for field prop - only requires what we actually use
interface RichTextEditorField {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ field }: { field: RichTextEditorField }) {
  // Helper function to safely parse content
  const getInitialContent = () => {
    if (!field.value) {
      return "<p> start typing here ....</p>";
    }

    try {
      // Try to parse as JSON first (Tiptap format)
      return JSON.parse(field.value);
    } catch (error) {
      console.error(error);
      // If parsing fails, treat as plain text and wrap in paragraph
      return `<p>${field.value}</p>`;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] focus:outline-none p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-full",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: getInitialContent(),
    immediatelyRender: false,
  });

  return (
    <div className="w-full border  rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
