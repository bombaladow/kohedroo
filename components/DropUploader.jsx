'use client';
import { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, X, Film } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

// رفع فوري: أول ما الملف يتسحب أو يتختار بيترفع على Supabase مباشرة
// من غير أي ضغط أو معالجة، ومعاه شريط تقدم.
export default function DropUploader({
  value,                 // الرابط الحالي (لو موجود)
  onUploaded,            // (url, file) => void
  onClear,               // () => void
  accept = 'image/*,video/*',
  label = 'Drag & drop or click to upload',
  bucket = 'portfolio-media',
  onBusyChange,          // (bool) => void  — عشان الفورم يعرف إن في رفع شغال
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(null); // null = مش بيرفع
  const [localPreview, setLocalPreview] = useState(null);
  const [isVideo, setIsVideo] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    const okType = file.type.startsWith('image/') || file.type.startsWith('video/');
    if (!okType) return toast.error('Only images or videos are allowed');

    setIsVideo(file.type.startsWith('video/'));
    setLocalPreview(URL.createObjectURL(file)); // معاينة فورية قبل ما الرفع يخلص
    setProgress(0);
    onBusyChange?.(true);

    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { data: { session } } = await supabase.auth.getSession();

      // XHR بدل supabase.upload عشان نجيب نسبة التقدم الحقيقية
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${supabase.storage.url}/object/${bucket}/${path}`);
        xhr.setRequestHeader('Authorization', `Bearer ${session?.access_token}`);
        xhr.setRequestHeader('apikey', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
        xhr.setRequestHeader('x-upsert', 'false');
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(xhr.responseText || 'Upload failed')));
        xhr.onerror = () => reject(new Error('Network error'));
        const body = new FormData();
        body.append('cacheControl', '31536000');
        body.append('', file);
        xhr.send(body);
      });

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
      onUploaded?.(publicUrl, file);
      toast.success('Uploaded');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
      setLocalPreview(null);
    } finally {
      setProgress(null);
      onBusyChange?.(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    upload(e.dataTransfer.files?.[0]);
  };

  const preview = localPreview || value;
  const uploading = progress !== null;

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ''; }}
        />

        {preview && !uploading ? (
          <div className="flex items-center gap-4 text-left">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 flex items-center justify-center flex-shrink-0">
              {isVideo || /\.(mp4|mov|webm)$/i.test(preview)
                ? <Film size={24} className="text-slate-500" />
                : <img src={preview} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={16} /> Ready
              </p>
              <p className="text-xs text-slate-500 truncate">Click or drop another file to replace</p>
            </div>
            {onClear && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLocalPreview(null); onClear(); }}
                className="p-2 text-slate-400 hover:text-red-500"
              >
                <X size={18} />
              </button>
            )}
          </div>
        ) : uploading ? (
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Uploading... {progress}%</p>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <UploadCloud size={32} />
            <p className="text-sm font-semibold">{label}</p>
          </div>
        )}
      </div>
    </div>
  );
}
