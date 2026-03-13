import { Heart } from 'lucide-react';

export function FooterAr() {
  const handleLoginClick = () => {
    window.location.href = '/admin';
  };

  return (
    <footer className="py-12 px-6 bg-stone-900 text-stone-400 border-t border-stone-800">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-amber-200" />
          <p className="text-sm">
            مكتوبة بقصد. مشاركة بأمل.
          </p>
        </div>
        <p className="text-xs text-stone-500 mb-4">
          © ٢٠٢٦ جميع الحقوق محفوظة. • سياسة الخصوصية • شروط الخدمة
        </p>
        <button
          onClick={handleLoginClick}
          className="text-amber-200 hover:text-amber-100 text-sm font-medium transition-colors"
        >
          تسجيل الدخول
        </button>
      </div>
    </footer>
  );
}
