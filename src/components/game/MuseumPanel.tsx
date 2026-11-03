import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { GameButton } from './ui';

export function MuseumPanel({ open, onClose, title, description, children, compact = false }: {
  open: boolean; onClose: () => void; title: string; description: string; children: ReactNode; compact?: boolean;
}) {
  return <Dialog.Root open={open} onOpenChange={(value) => { if (!value) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="museum-scrim" />
      <Dialog.Content className={`museum-panel ${compact ? 'museum-panel-compact' : ''}`}>
        <header className="museum-panel-heading">
          <div><p className="text-xs uppercase text-primary">Study Museum</p><Dialog.Title className="mt-1 font-serif text-3xl">{title}</Dialog.Title></div>
          <Dialog.Close asChild><GameButton variant="ghost" aria-label="Close panel" className="h-10 w-10 p-0"><X size={20} /></GameButton></Dialog.Close>
        </header>
        <Dialog.Description className="sr-only">{description}</Dialog.Description>
        <div className="museum-panel-body">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}