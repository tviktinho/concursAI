import './App.css'

function App() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="container-responsive flex items-center justify-between h-14">
          <a href="/index.html" className="font-semibold text-slate-900 dark:text-slate-100">Concursando</a>
          <nav className="flex items-center gap-4 text-sm">
            <a className="hover:text-brand-600" href="/quiz.html">Quiz</a>
            <a className="hover:text-brand-600" href="/resultados.html">Resultados</a>
            <a className="hover:text-brand-600" href="/desempenho.html">Desempenho</a>
            <a className="inline-flex items-center rounded-md bg-brand-600 text-white px-3 py-1.5 hover:bg-brand-700" href="/login.html">Entrar</a>
          </nav>
        </div>
      </header>
      <section className="container-responsive flex-1 py-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight">Estude para concursos com mais eficiência</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Refatorando o frontend com React + Tailwind, mantendo os mesmos endpoints do backend.</p>
          <div className="mt-6 flex gap-3">
            <a href="/quiz.html" className="inline-flex items-center rounded-md bg-brand-600 text-white px-4 py-2 hover:bg-brand-700">Começar agora</a>
            <a href="/login.html" className="inline-flex items-center rounded-md border border-slate-300 dark:border-slate-700 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">Entrar</a>
          </div>
        </div>
      </section>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-sm text-slate-500">
        <div className="container-responsive">© {new Date().getFullYear()} Concursando</div>
      </footer>
    </main>
  )
}

export default App
