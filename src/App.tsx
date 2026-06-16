import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HallPage from "@/pages/HallPage";
import CreatePage from "@/pages/CreatePage";
import BoxDetailPage from "@/pages/BoxDetailPage";
import ChatPage from "@/pages/ChatPage";
import ResultPage from "@/pages/ResultPage";
import PaymentPage from "@/pages/PaymentPage";
import HistoryPage from "@/pages/HistoryPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HallPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/box/:id" element={<BoxDetailPage />} />
        <Route path="/box/:id/chat" element={<ChatPage />} />
        <Route path="/box/:id/result" element={<ResultPage />} />
        <Route path="/box/:id/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}
