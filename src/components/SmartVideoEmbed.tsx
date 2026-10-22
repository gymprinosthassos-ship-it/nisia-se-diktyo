import React from 'react';
import { Video, ExternalLink } from 'lucide-react';

interface SmartVideoEmbedProps {
  url?: string | null;
  title?: string;
}

export const SmartVideoEmbed: React.FC<SmartVideoEmbedProps> = ({ url, title }) => {
  if (!url) return null;

  const trimmedUrl = url.trim();

  // 1. Πανελλήνιο Σχολικό Δίκτυο (video.sch.gr)
  if (trimmedUrl.includes('video.sch.gr')) {
    // Υποστηρίζει: video.sch.gr/asset/detail/XYZ ή video.sch.gr/embed/XYZ
    const cleanUrl = trimmedUrl.replace(/\/$/, '');
    const parts = cleanUrl.split('/');
    const videoId = parts[parts.length - 1];

    return (
      <div className="my-3 overflow-hidden rounded-xl border border-blue-200 bg-slate-900 shadow">
        <div className="bg-blue-900 text-blue-100 px-3 py-1.5 text-xs font-medium flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5" />
          <span>Βίντεο Πανελλήνιου Σχολικού Δικτύου (video.sch.gr)</span>
        </div>
        <div className="relative aspect-video w-full">
          <iframe
            src={`https://video.sch.gr/embed/${videoId}`}
            title={title || 'Βίντεο ΠΣΔ'}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // 2. YouTube (Unlisted, Short links youtu.be ή standard)
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const ytMatch = trimmedUrl.match(youtubeRegex);

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return (
      <div className="my-3 overflow-hidden rounded-xl border border-red-200 bg-slate-900 shadow">
        <div className="bg-red-900 text-red-100 px-3 py-1.5 text-xs font-medium flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5" />
          <span>Βίντεο YouTube (Εκπαιδευτικό Τεκμήριο)</span>
        </div>
        <div className="relative aspect-video w-full">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
            title={title || 'YouTube Player'}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // 3. Fallback: Απλός Εξωτερικός Σύνδεσμος
  return (
    <div className="my-2 p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
      <span className="font-medium text-slate-700 truncate max-w-xs">{title || 'Εξωτερική πηγή'}:</span>
      <a 
        href={trimmedUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
      >
        <span>Άνοιγμα συνδέσμου</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
