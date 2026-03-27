export function Footer() {
  return (
    <footer className="mt-16 border-t border-torn-green/20 bg-bg-secondary">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-text-secondary">
        <p>Built by <span className="text-torn-green">bombel</span> for <span className="text-torn-green">The Masters</span></p>
        <p className="mt-1">Powered by <a href="https://www.torn.com/swagger/index.html" target="_blank" rel="noopener noreferrer" className="text-torn-green hover:underline">Torn API v2</a></p>
        <p className="mt-1 text-xs">v1.0.0</p>
      </div>
    </footer>
  );
}
