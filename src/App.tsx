import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { GitHubSection } from './components/GitHubSection'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-accent focus:bg-bg focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-fg"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main" className="lg:pl-[250px]">
        <Hero />
        <About />
        <Skills />
        <GitHubSection />
        <Projects />
        <Contact />
      </main>

      <div className="lg:pl-[250px]">
        <Footer />
      </div>
    </div>
  )
}
