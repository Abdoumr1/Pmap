import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./HOme";
import Books from "./Books";
import Articles from "./Articles";
import Quiz from "./Quiz";
import Card from "./Card";
import Games from "./Games";
import logopfe from "./images/logoth.png";
import { Link } from "react-router-dom";
import PDF from './pdfv';
import { pdfjs } from "react-pdf";
import ArticleDetail from './DetailArticle';
import QuizStart from "./QuizStart";
import WordGame from "./WordGame";
import PDFViewer from "./pdfv";
import Contact from "./Contact";
import Login from "./Login";
import Signup from "./SignUp";
import Footer from "./Footer";
import FindDifference from "./FindDifference";
import AgeSelection from "./AgeSelection";
import MemoryGames from "./MemoryGames";
import PuzzleGame from "./Puzzles";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function AppContent() {
  const location = useLocation();

  const ageSelected = localStorage.getItem("ageGroup");

  // show card ONLY if age is selected AND we are in home
  const showCard = location.pathname === "/home" && ageSelected;

  return (
    <div className="min-h-screen">

      <Navbar />
      <Link className="flex items-center justify-center mx-2 my-1" to="/home">
        <img
          src={logopfe}
          className="pt-7 h-[350px] w-[320px] bg-transparent"
          style={{ filter: "brightness(1.1) contrast(1.2)" }}
        />
      </Link>
      {showCard && <Card />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AgeSelection" element={<AgeSelection />} />
        <Route path="/card" element={<Card />} />
        <Route path="/books" element={<Books />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/quizzes" element={<Quiz />} />
        <Route path="/games" element={<Games />} />
        <Route path="/read/:bookId" element={<PDF />} />
        <Route path="/article/:articleId" element={<ArticleDetail />} />
        <Route path="/quizzes/:id" element={<QuizStart />} />
        <Route path="/game/:id" element={<WordGame />} />
        <Route path="/find-difference" element={<FindDifference />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/games/memory" element={<MemoryGames />} />
        <Route path="/games/puzzle" element={<PuzzleGame />} />
      </Routes>
      <Footer />
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