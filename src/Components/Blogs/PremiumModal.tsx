import { Button } from "../ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PremiumModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-zinc-900 rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Baca artikel premium di Pshh</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400">✕</button>
        </div>

        <div className="p-6">
          <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">Konten ini adalah artikel premium. Untuk membuka dan membaca isi lengkapnya, gunakan aplikasi Pshh.</p>

          <div className="flex items-center gap-3">
            <a href="https://s.id/pshhapp" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button text="Download" variant="primary" className="w-full justify-center" />
            </a>
          </div>

          <p className="mt-3 text-xs text-slate-400">Download dan baca artikel premium di aplikasi saya</p>
        </div>
      </div>
    </div>
  );
}
