import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import ParticleBackground from './components/ParticleBackground.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import About from './pages/About.jsx'
import Skills from './pages/Skills.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import { projects } from './data/projects.js'

const titles = {
  '/': 'Mary Grace V. Soronio · Embedded Systems, MSU-IIT',
  '/projects': 'Builds · Mary Grace V. Soronio',
  '/about': 'About · Mary Grace V. Soronio',
  '/skills': 'Skills & toolchain · Mary Grace V. Soronio',
  '/contact': 'Contact · Mary Grace V. Soronio',
}

function RouteEffects() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  useEffect(() => {
    if (titles[pathname]) {
      document.title = titles[pathname]
      return
    }
    const slug = pathname.startsWith('/projects/') ? pathname.slice('/projects/'.length) : null
    const project = slug ? projects.find((item) => item.slug === slug || item.aliasSlugs?.includes(slug)) : null
    document.title = project
      ? `${project.title} · Mary Grace V. Soronio`
      : '404 · Page Not Found · Mary Grace V. Soronio'
  }, [pathname])

  return null
}

export default function App() {
  const { pathname } = useLocation()

  return (
    <>
      <ParticleBackground />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="relative z-10">
        <RouteEffects />
        <div key={pathname} className="page-enter">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  )
}
