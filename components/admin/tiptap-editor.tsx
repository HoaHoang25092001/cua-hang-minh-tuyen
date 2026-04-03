"use client";
// components/admin/tiptap-editor.tsx
// Rich text editor cho trường description trong Admin (tiptap + table)

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Image as TiptapImage } from "@tiptap/extension-image";
import type { CustomInputProps } from "@premieroctet/next-admin";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

// ── Toolbar button ──────────────────────────────────────────────────────────
function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded px-2 py-1 text-xs font-medium transition-colors",
        "border border-transparent",
        active
          ? "bg-zinc-700 text-white"
          : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ── Separator ───────────────────────────────────────────────────────────────
function Sep() {
  return <span className="mx-1 h-4 w-px self-center bg-zinc-300 dark:bg-zinc-600" />;
}

// ── Helper: fire synthetic change event (same pattern as ImageUploadInput) ──
function fireChange(
  html: string,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
) {
  if (!onChange) return;
  const input = document.createElement("input");
  input.value = html;
  const evt = new Event("change", {
    bubbles: true,
  }) as unknown as ChangeEvent<HTMLInputElement>;
  Object.defineProperty(evt, "target", { value: input });
  onChange(evt);
}

// ── Main component ──────────────────────────────────────────────────────────
export function TiptapEditor({
  name,
  value,
  onChange,
  disabled,
  readonly,
}: CustomInputProps) {
  const isReadOnly = disabled || readonly;
  const [imgUploading, setImgUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("imageUploader");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      TiptapImage.configure({ inline: false, allowBase64: false }),
    ],
    content: (value as string) ?? "",
    editable: !isReadOnly,
    onUpdate({ editor }) {
      fireChange(editor.getHTML(), onChange);
    },
  });

  // Khi value thay đổi từ bên ngoài (VD: khi next-admin load dữ liệu edit)
  useEffect(() => {
    if (!editor) return;
    const incoming = (value as string) ?? "";
    if (editor.getHTML() !== incoming) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div className="rounded border border-input bg-background shadow-sm">
      {/* Hidden input giữ giá trị HTML để next-admin lưu vào form state */}
      <input
        type="hidden"
        name={name}
        value={(value as string) ?? ""}
        readOnly
      />

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file || !editor) return;
          setImgUploading(true);
          try {
            const res = await startUpload([file]);
            const url = res?.[0]?.ufsUrl ?? res?.[0]?.url ?? "";
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          } finally {
            setImgUploading(false);
            // reset so same file can be picked again
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        }}
      />

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      {!isReadOnly && editor && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-zinc-50 p-1.5 dark:bg-zinc-800">
          {/* Text format */}
          <ToolbarButton
            title="In đậm (Ctrl+B)"
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            title="In nghiêng (Ctrl+I)"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            title="Gạch ngang (Ctrl+Shift+S)"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
          >
            <s>S</s>
          </ToolbarButton>

          <Sep />

          {/* Headings */}
          <ToolbarButton
            title="Tiêu đề 1"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            title="Tiêu đề 2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            title="Tiêu đề 3"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
          >
            H3
          </ToolbarButton>

          <Sep />

          {/* Lists */}
          <ToolbarButton
            title="Danh sách bullet"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
          >
            • List
          </ToolbarButton>
          <ToolbarButton
            title="Danh sách số"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
          >
            1. List
          </ToolbarButton>

          <Sep />

          {/* Blockquote */}
          <ToolbarButton
            title="Trích dẫn"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
          >
            ❝
          </ToolbarButton>
          <ToolbarButton
            title="Kẻ ngang"
            onClick={() =>
              editor.chain().focus().setHorizontalRule().run()
            }
          >
            ―
          </ToolbarButton>

          <Sep />

          {/* Table controls */}
          <ToolbarButton
            title="Chèn bảng 3×3"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            ⊞ Bảng
          </ToolbarButton>
          <ToolbarButton
            title="Thêm cột sau"
            onClick={() =>
              editor.chain().focus().addColumnAfter().run()
            }
            disabled={!editor.can().addColumnAfter()}
          >
            +Cột
          </ToolbarButton>
          <ToolbarButton
            title="Xóa cột"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            disabled={!editor.can().deleteColumn()}
          >
            -Cột
          </ToolbarButton>
          <ToolbarButton
            title="Thêm hàng sau"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            disabled={!editor.can().addRowAfter()}
          >
            +Hàng
          </ToolbarButton>
          <ToolbarButton
            title="Xóa hàng"
            onClick={() => editor.chain().focus().deleteRow().run()}
            disabled={!editor.can().deleteRow()}
          >
            -Hàng
          </ToolbarButton>
          <ToolbarButton
            title="Xóa bảng"
            onClick={() => editor.chain().focus().deleteTable().run()}
            disabled={!editor.can().deleteTable()}
          >
            Xóa bảng
          </ToolbarButton>

          <Sep />

          {/* Image upload */}
          <ToolbarButton
            title="Chèn ảnh từ máy tính"
            onClick={() => fileInputRef.current?.click()}
            disabled={imgUploading}
          >
            {imgUploading ? "⏳" : "🖼 Ảnh"}
          </ToolbarButton>

          <Sep />

          {/* Undo / Redo */}
          <ToolbarButton
            title="Hoàn tác (Ctrl+Z)"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            ↩
          </ToolbarButton>
          <ToolbarButton
            title="Làm lại (Ctrl+Y)"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            ↪
          </ToolbarButton>
        </div>
      )}

      {/* ── Editor content area ──────────────────────────────────────────── */}
      <EditorContent
        editor={editor}
        className={[
          "tiptap-content min-h-[200px] px-3 py-2 text-sm",
          isReadOnly ? "cursor-not-allowed opacity-60" : "",
        ].join(" ")}
      />
    </div>
  );
}
