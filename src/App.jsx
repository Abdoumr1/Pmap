import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./HOme";
import Books from "./Books";
import Articles from "./Articles";
import Quiz from "./Quiz";
import Card from "./Card";
import Games from "./Games";
import logopfe from "./images/pmap.png"
import { Link } from 'react-router-dom';
import PDF from './pdfv';
import { pdfjs } from "react-pdf";
import ArticleDetail from './DetailArticle';
import QuizStart from "./QuizStart";
import WordGame from "./WordGame";
import PDFViewer from "./pdfv";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
function AppContent() {
  const location = useLocation();
  const showCard = location.pathname === "/"; // Only show on home page

  return (
    <div className=" min-h-screen">
      <Navbar />
      <Link
        className="flex items-center justify-center mx-2 my-1"
        to="/"
      >
        <img
          className="xs:mx-auto pt-7"
          src={logopfe}
          style={{
            height: '200px',
            width: '300px',

          }}
          alt="PFE Logo"
          loading="lazy"
        />
      </Link>

      {showCard && <Card />}

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/games" element={<Games />} />
        <Route path="/read/:bookId" element={<PDF />} />
        <Route path="/article/:articleId" element={<ArticleDetail />} />
        <Route path="/quiz/:quizId" element={<QuizStart />} />
        <Route path="/game/:id" element={<WordGame />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;