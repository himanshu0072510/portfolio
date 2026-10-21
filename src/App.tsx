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
      <Nav />
      <main className="lg:pl-64">
        <Hero />
        <About />
        <Skills />
        <GitHubSection />
        <Projects />
        <Contact />
      </main>
      <div className="lg:pl-64">
        <Footer />
      </div>
    </div>
  )
}
