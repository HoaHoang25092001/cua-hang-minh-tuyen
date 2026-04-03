"use client";
// components/admin/placeholder-input.tsx
// Input wrapper tái sử dụng cho next-admin – hỗ trợ placeholder và type

import type { CustomInputProps } from "@premieroctet/next-admin";
import type { ChangeEvent } from "react";

interface PlaceholderInputProps extends CustomInputProps {
  placeholder?: string;
  type?: "text" | "number" | "email" | "url";
}

export function PlaceholderInput({
  name,
  value,
  onChange,
  disabled,
  readonly,
  placeholder,
  type = "text",
}: PlaceholderInputProps) {
  const displayValue = value == null ? "" : String(value);

  return (
    <input
      type={type}
      name={name}
      value={displayValue}
      onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
      disabled={disabled || readonly}
      placeholder={placeholder}
      className="w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}
