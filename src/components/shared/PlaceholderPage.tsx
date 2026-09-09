// Placeholder — Coming Soon page component
'use client';
import { Construction } from 'lucide-react';
import Link from 'next/link';

export default function PlaceholderPage({ title, description, backHref }: { title: string; description: string; backHref: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center justify-center rounded-2xl mb-6" style={{ width: 72, height: 72, background: 'var(--color-primary-pale)' }}>
        <Construction size={32} style={{ color: 'var(--color-primary)' }} />
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{title}</h2>
      <p className="text-sm max-w-md mb-6" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
      <Link href={backHref} className="btn btn-primary no-underline text-sm">← Go Back</Link>
    </div>
  );
}
