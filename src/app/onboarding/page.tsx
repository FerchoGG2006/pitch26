export default function OnboardingPage() {
    return (
        <div className="h-screen bg-void flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-display font-black text-gold mb-4 uppercase">Elige tu Nación</h1>
            <p className="text-txt2 text-sm mb-12">Esta será tu carta garantizada en el sobre de bienvenida.</p>
            <div className="grid grid-cols-4 gap-4 w-full max-w-sm">
                {['🇦🇷', '🇧🇷', '🇫🇷', '🇪🇸', '🇬🇧', '🇩🇪', '🇮🇹', '🇺🇾'].map(flag => (
                    <button key={flag} className="w-16 h-16 bg-panel border-2 border-rim rounded-xl text-3xl flex items-center justify-center hover:border-gold hover:bg-deep transition-colors">
                        {flag}
                    </button>
                ))}
            </div>
            <button className="mt-12 w-full max-w-sm bg-gradient-to-r from-gold to-gold-dark text-void font-bold font-display uppercase tracking-wider py-4 rounded-full text-xl shadow-lg shadow-gold/20">
                Continuar
            </button>
        </div>
    );
}
