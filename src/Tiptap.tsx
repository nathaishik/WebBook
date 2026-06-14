// src/Tiptap.tsx
import { useEditor, EditorContent, EditorContext, type JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useMemo } from 'react'

import { Placeholder } from '@tiptap/extensions'
import Blockquote from '@tiptap/extension-blockquote'


export default function Tiptap(
    { text, onChange }: { text: JSONContent, onChange: (value: JSONContent) => void }
) {
  const editor = useEditor({
    extensions: [StarterKit,
      Placeholder.configure({
        placeholder: 'Type something...',
        emptyEditorClass: 'is-editor-empty',
      }),
      Blockquote,
    ], // define your extension array
    content: text, // initial content
    onUpdate: ({ editor }) => {
        onChange?.(editor.getJSON());
    }
  })

  // Memoize the provider value to avoid unnecessary re-renders
  const providerValue = useMemo(() => ({ editor }), [editor])

    // const editorState = useEditorState({
    //     editor,

    //     selector: ({ editor }) => {
    //         if (!editor) return null;
    //         return {
    //             isEditable: editor.isEditable,
    //             currentSelection: editor.state.selection,
    //             currentContent: editor.getJSON(),
    //         }
    //     }
    // })

  return (
    <EditorContext.Provider value={providerValue}>
      <EditorContent editor={editor} />
    </EditorContext.Provider>
  )
}
