import "./App.css";
import AboutContent from "./Components/About/ContentAbout";
import Projects from "./Components/Projects/Projects";
import Skills from "./Components/About/Skills";
import Newsletter from "./Components/LiveFeatures/Newsletter";
import Footer from "./Components/Layout/Footer";
import BottomBlur from "./Components/Layout/BottomBlur";
import Contributions from "./Components/Social/Contributions";
import GithubHeatmap from "./Components/Social/GithubHeatmap";
import { Routes, Route } from "react-router-dom";
import ContributionsPage from "./Pages/ContributionsPage";
import ProjectsPage from "./Pages/ProjectsPage";
import BlogsPage from "./Pages/BlogsPage";
import BlogViewer from "./Components/Blogs/BlogViewer";
import { SpeedInsights } from "@vercel/speed-insights/react";
import BottomDockMode from "./Components/Navigation/BottomDockMode";
import LivePingOverlay from "./Components/LiveFeatures/LivePingOverlay";
import MacbookLoader from "./Components/Layout/MacbookLoader";
import { useState, useRef } from "react";
import { useTheme } from "./contexts/ThemeContext";
import AboutMe from "./Components/About/AboutMe";
import Experience from "./Components/About/Experience";
import LeftSideLabel from "./Components/Layout/LeftSideLabel";
import BackgroundPattern from "./Components/Layout/BackgroundPattern";
import HorizonGlow from "./Components/Layout/HorizonGlow";
import ScrollToTop from "./Components/LiveFeatures/ScrollToTop";
import RightSideLabel from "./Components/Layout/RightSideLabel";
import FirestoreBlogs from "./Components/Blogs/FirestoreBlogs";

const HomePage = () => {
  return (
    <div>
      <main className="min-h-screen max-w-3xl mx-auto flex items-center flex-col">
        <AboutMe />
        <AboutContent />
        <Experience />
        <Projects
          limit={4}
          featuredTitles={["Okunix", "OpenDesk", "Auto-Timetable", "Pebble"]}
          showViewAll={true}
        />
        <Contributions limit={3} showViewAll={true} />
        <GithubHeatmap username="SAYOUNCDR" />
        <FirestoreBlogs limit={2} showViewAll={true} />
        <Skills />
        <Newsletter />
        <Footer />
      </main>
      <BottomBlur />
      <SpeedInsights />
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const hasAutoToggled = useRef(false);
  const { setTheme } = useTheme();
  const pendingButtonPoll = useRef<ReturnType<typeof setInterval> | null>(null);
  const darkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const findToggleButton = () => document.querySelector<HTMLButtonElement>('button[aria-label="Toggle theme"]');

  const waitForToggleButton = (): Promise<HTMLButtonElement | null> => {
    return new Promise((resolve) => {
      const button = findToggleButton();
      if (button) {
        resolve(button);
        return;
      }

      let attempts = 0;
      pendingButtonPoll.current = setInterval(() => {
        const nextButton = findToggleButton();
        if (nextButton) {
          if (pendingButtonPoll.current) clearInterval(pendingButtonPoll.current);
          pendingButtonPoll.current = null;
          resolve(nextButton);
          return;
        }

        attempts += 1;
        if (attempts >= 20) {
          if (pendingButtonPoll.current) clearInterval(pendingButtonPoll.current);
          pendingButtonPoll.current = null;
          resolve(null);
        }
      }, 50);
    });
  };

  const clickAtButtonCenter = (button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect();
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    });
    button.dispatchEvent(event);
  };

  const clickThemeToggle = async (fallback: 'light' | 'dark') => {
    const button = await waitForToggleButton();
    if (button) {
      clickAtButtonCenter(button);
    } else {
      setTheme(fallback);
    }
  };

  const startAutoToggleSequence = () => {
    if (hasAutoToggled.current) return;
    hasAutoToggled.current = true;

    // Start shortly after loader finishes (no 2s idle); then toggle back to light after 2s.
    darkTimer.current = setTimeout(() => {
      clickThemeToggle('dark');
      lightTimer.current = setTimeout(() => {
        clickThemeToggle('light');
      }, 2000);
    }, 100);
  };

  const handleLoaderComplete = () => {
    setTheme('light');
    setIsLoading(false);
    startAutoToggleSequence();
  };

  return (
    <>
      <ScrollToTop />
      <LivePingOverlay />
      <RightSideLabel />
      <LeftSideLabel />
      <BackgroundPattern />
      <HorizonGlow />
      <BottomDockMode />
      {isLoading && <MacbookLoader onComplete={handleLoaderComplete} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contributions" element={<ContributionsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogViewer />} />
      </Routes>
    </>
  );
}

export default App;
