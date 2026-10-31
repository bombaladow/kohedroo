'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { UploadCloud, X, Film } from 'lucide-react';

/**
 * Drag & drop / click / paste file picker with live preview.
 *  - multiple=false: value is a File (or null); shows a preview + remove button.
 *  - multiple=true : calls onFiles(fileArray) right away (used for bulk upload).
 */
export default function DropZone({
  accept = 'image/*',
  multiple = false,
  value = null,
  existingUrl = null,
  onChange,
  onFiles,
  label = 'Drag & drop here, or click to browse',
  hint,
  compact = false,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  const matches = (f) =>
    accept.split(',').some((a) => {
      a = a.trim();
      if (a.endsWith('/*')) return f.type.startsWith(a.slice(0, -1));
      return f.type === a || f.name.toLowerCase().endsWith(a);
    });

  const preview = useMemo(
    () => (value ? { url: URL.createObjectURL(value), isVideo: value.type.startsWith('video/') } : null),
    [value]
  );
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview.url); }, [preview]);

  const handle = (list) => {
    const files = Array.from(list || []).filter(matches);
    if (!files.length) return;
    if (multiple) onFiles?.(files);
    else onChange?.(files[0]);
  };

  const shown = preview || (existingUrl ? { url: existingUrl, isVideo: /\.(mp4|mov|webm)(\?|$)/i.test(existingUrl) } : null);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); if (!disabled) handle(e.dataTransfer.files); }}
      onPaste={(e) => !disabled && handle(e.clipboardData.files)}
      className={`relative flex items-center justify-center gap-4 rounded-xl border-2 border-dashed text-center transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black
        ${over ? 'border-black bg-slate-100' : 'border-slate-300 bg-slate-50 hover:border-slate-500'}
        ${compact ? 'p-4' : 'p-8'} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => { handle(e.target.files); e.target.value = ''; }}
      />

      {shown && !multiple ? (
        <>
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-200 border border-slate-200 flex items-center justify-center flex-shrink-0">
            {shown.isVideo
              ? <video src={shown.url} muted preload="metadata" className="w-full h-full object-cover" />
              : <img src={shown.url} alt="" className="w-full h-full object-contain" />}
          </div>
          <div className="text-left min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">{value ? value.name : 'Current file'}</p>
            <p className="text-xs text-slate-500">Drop another file to replace</p>
          </div>
          {value && (
            <button
              type="button"
              aria-label="Remove file"
              onClick={(e) => { e.stopPropagation(); onChange?.(null); }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-red-600"
            >
              <X size={14} />
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-2">
          {accept.includes('video') ? <Film size={compact ? 22 : 30} className="text-slate-400" /> : <UploadCloud size={compact ? 22 : 30} className="text-slate-400" />}
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
      )}
    </div>
  );
}
