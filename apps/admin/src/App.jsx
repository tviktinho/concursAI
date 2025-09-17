import './App.css'

function App() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="container-responsive flex items-center justify-between h-14">
          <a href="/index.html" className="font-semibold text-slate-900 dark:text-slate-100">Admin • Concursando</a>
          <nav className="flex items-center gap-4 text-sm">
            <a className="hover:text-brand-600" href="/usuarios.html">Usuários</a>
            <a className="hover:text-brand-600" href="/temas.html">Temas</a>
            <a className="hover:text-brand-600" href="/categorias.html">Categorias</a>
          </nav>
        </div>
      </header>
      <section className="container-responsive flex-1 py-12">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Área administrativa separada, construída com React + Tailwind.</p>
      </section>
    </main>
  )
}

export default App
