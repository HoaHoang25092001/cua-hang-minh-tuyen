"use client";
// components/admin/image-upload-input.tsx
// Custom input cho next-admin: upload ảnh qua UploadThing hoặc nhập URL thủ công
import { type ChangeEvent, useRef, useState } from "react";
import type { CustomInputProps } from "@premieroctet/next-admin";
import { useUploadThing } from "@/lib/uploadthing";

export function ImageUploadInput({
  name,
  value,
  onChange,
  disabled,
  readonly,
}: CustomInputProps) {
  const [preview, setPreview] = useState<string>((value as string) ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError: (err) => setError(err.message),
  });

  const isReadOnly = disabled || readonly;

  // Tạo ChangeEvent tổng hợp để tương thích với next-admin CustomInputProps
  function fireChange(url: string) {
    setPreview(url);
    if (!onChange) return;
    const nativeInput = document.createElement("input");
    nativeInput.value = url;
    const evt = new Event("change", { bubbles: true }) as unknown as ChangeEvent<HTMLInputElement>;
    Object.defineProperty(evt, "target", { value: nativeInput });
    onChange(evt);
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const res = await startUpload([file]);
      const url = res?.[0]?.ufsUrl ?? res?.[0]?.url ?? "";
      if (url) fireChange(url);
    } finally {
      setUploading(false);
      // Reset file input để có thể chọn lại cùng file
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleUrlChange(e: ChangeEvent<HTMLInputElement>) {
    setPreview(e.target.value);
    if (onChange) onChange(e);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Preview ảnh */}
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Preview"
          className="h-28 w-28 rounded border object-cover"
        />
      )}

      {/* Input URL thủ công */}
      <input
        type="text"
        name={name}
        value={preview}
        onChange={handleUrlChange}
        disabled={isReadOnly}
        placeholder="Nhập URL ảnh hoặc upload từ máy tính bên dưới"
        className="w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />

      {/* Nút upload từ máy */}
      {!isReadOnly && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Đang upload…" : "Chọn ảnh từ máy"}
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => fireChange("")}
              className="text-sm text-destructive hover:underline"
            >
              Xóa ảnh
            </button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
