import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

// Load pdfjs once globally
let _pdfjs = null;
const getPdfJs = async () => {
  if (_pdfjs) return _pdfjs;
  _pdfjs = await import("pdfjs-dist/legacy/build/pdf");
  _pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  return _pdfjs;
};

export default function PDFViewer() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.4);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState(null);
  const [pageInput, setPageInput] = useState("1");

  const canvasRef = useRef(null);
  const renderTask = useRef(null);
  const fetchedRef = useRef(false);

  // ── 1. Fetch book + load PDF binary ─────────────────────────────
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/books/`);
        const list = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        const found = list.find((b) => b.id === parseInt(bookId, 10));

        if (!found) { setError("not_found"); return; }
        if (!found.pdf_file) { setError("no_pdf"); return; }
        setBook(found);

        const url = found.pdf_file.startsWith("http")
          ? found.pdf_file
          : `${API_BASE}${found.pdf_file}`;

        const resp = await axios.get(url, { responseType: "arraybuffer" });
        const bytes = new Uint8Array(resp.data);

        // Validate it's actually a PDF
        const magic = String.fromCharCode(...bytes.slice(0, 5));
        if (!magic.startsWith("%PDF")) {
          setError(magic.startsWith("PK") ? "wrong_format" : "not_pdf");
          return;
        }

        const lib = await getPdfJs();
        const task = lib.getDocument({ data: bytes, stopAtErrors: false });
        task.onPassword = () => { setError("pdf_password"); setLoading(false); };
        const doc = await task.promise;

        setPdfDoc(doc);
        setTotalPages(doc.numPages);
      } catch (e) {
        console.error("Load error:", e);
        setError("fetch_failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [bookId]);

  // ── 2. Render page onto <canvas> ────────────────────────────────
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    // Cancel previous render
    if (renderTask.current) {
      try { renderTask.current.cancel(); } catch (_) { }
      renderTask.current = null;
    }

    setRendering(true);
    try {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const task = page.render({ canvasContext: ctx, viewport });
      renderTask.current = task;
      await task.promise;
    } catch (e) {
      if (e?.name !== "RenderingCancelledException") console.error("Render error:", e);
    } finally {
      setRendering(false);
    }
  }, [pdfDoc, currentPage, scale]);

  useEffect(() => { renderPage(); }, [renderPage]);

  // ── 3. Navigation helpers ────────────────────────────────────────
  const goTo = useCallback((n) => {
    const p = Math.max(1, Math.min(n, totalPages));
    setCurrentPage(p);
    setPageInput(String(p));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [totalPages]);

  const handleInputBlur = () => {
    const n = parseInt(pageInput, 10);
    goTo(isNaN(n) ? currentPage : n);
  };

  // Keep input in sync when page changes via buttons
  useEffect(() => { setPageInput(String(currentPage)); }, [currentPage]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(currentPage + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(currentPage - 1);
      if (e.key === "+" || e.key === "=") setScale(s => Math.min(3, +(s + 0.2).toFixed(1)));
      if (e.key === "-") setScale(s => Math.max(0.5, +(s - 0.2).toFixed(1)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentPage, goTo]);

  // ── 4. Error / loading screens ───────────────────────────────────
  const ERRORS = {
    not_found: { icon: "📚❌", msg: "Book not found." },
    no_pdf: { icon: "📄❌", msg: "No PDF file attached to this book." },
    not_pdf: { icon: "⚠️❌", msg: "Server returned an invalid file. Check MEDIA_URL in Django settings." },
    wrong_format: { icon: "📊❌", msg: "This is a PowerPoint/Word file, not a PDF. Re-upload a .pdf in Django admin (/admin)." },
    pdf_password: { icon: "🔒❌", msg: "This PDF is password-protected and cannot be displayed." },
    fetch_failed: { icon: "🌐❌", msg: "Cannot reach the server. Is Django running on port 8000?" },
  };

  if (loading) return <Spinner text="Loading book…" />;

  if (error) {
    const e = ERRORS[error] ?? ERRORS.fetch_failed;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm w-full mx-4">
          <div className="text-6xl mb-4">{e.icon}</div>
          <p className="text-gray-700 mb-6 leading-relaxed">{e.msg}</p>
          <button onClick={() => navigate("/books")}
            className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  // ── 5. Main reader UI ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-300 flex flex-col">

      {/* ═══ Top Header ═══ */}
      <header className="bg-white shadow-md px-4 py-3 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">

          {/* Back button */}
          <button onClick={() => navigate("/books")}
            className="p-2 bg-green-700 hover:bg-green-800 rounded-full transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          {/* Book title */}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-800 text-lg truncate leading-tight">{book?.title}</h1>
            <p className="text-xs text-gray-500 truncate">by {book?.author}</p>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setScale(s => Math.max(0.5, +(s - 0.2).toFixed(1)))}
              className="px-3 py-2 hover:bg-gray-100 transition-colors border-r border-gray-200"
              title="Zoom out (-)">
              <ZoomOut className="w-4 h-4 text-gray-600" />
            </button>
            <span className="px-3 text-sm text-gray-600 font-medium select-none">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(s => Math.min(3, +(s + 0.2).toFixed(1)))}
              className="px-3 py-2 hover:bg-gray-100 transition-colors border-l border-gray-200"
              title="Zoom in (+)">
              <ZoomIn className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${currentPage === 1
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800 text-white"
                }`}>
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
              <input
                type="number" min={1} max={totalPages}
                value={pageInput}
                onChange={e => setPageInput(e.target.value)}
                onBlur={handleInputBlur}
                onKeyDown={e => e.key === "Enter" && handleInputBlur()}
                className="w-14 px-2 py-1 border border-gray-300 rounded-lg text-center text-sm font-semibold focus:outline-none focus:border-green-500"
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">/ {totalPages}</span>
            </div>

            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${currentPage === totalPages
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800 text-white"
                }`}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ═══ PDF Canvas ═══ */}
      <main className="flex-1 flex flex-col items-center py-8 px-4">
        <div className="relative inline-block">
          {/* Loading overlay while rendering */}
          {rendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 rounded">
              <Loader className="w-10 h-10 text-green-700 animate-spin" />
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="shadow-2xl rounded block"
            style={{ maxWidth: "100%", background: "#fff" }}
          />
        </div>

        <p className="mt-4 text-sm text-gray-500 select-none">
          Page {currentPage} of {totalPages}
          <span className="ml-2 text-gray-400 hidden sm:inline">
            · Use ← → arrow keys to navigate · +/- to zoom
          </span>
        </p>
      </main>

      {/* ═══ Bottom Bar ═══ */}
      <footer className="bg-white border-t px-4 py-3 sticky bottom-0 z-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors ${currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800"
              }`}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-sm text-gray-500 hidden sm:block truncate max-w-xs">
            {book?.title}
          </span>

          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors ${currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800"
              }`}>
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

function Spinner({ text }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
      <p className="text-gray-600 text-lg">{text}</p>
    </div>
  );
}