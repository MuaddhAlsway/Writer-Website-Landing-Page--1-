import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-stone-900 text-stone-400 border-t border-stone-800">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-amber-200" />
          <p className="text-sm">
            Written with intention. Shared with hope.
          </p>
        </div>
        <p className="text-xs text-stone-500">
          © 2026 All rights reserved. • Privacy Policy • Terms of Service
        </p>
      </div>
    </footer>
  );
}
