import React, { useState } from "react";
import axios from "axios";

const GoogleGeminiButton: React.FC = () => {
  const [question, setQuestion] = useState<string>(""); // Câu hỏi từ người dùng
  const [answer, setAnswer] = useState<string>(""); // Câu trả lời từ API
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading

  const apiKey = "AIzaSyBQ57Af2mg0vi_3WKdYwPFJ49JVTY2s9ZU"; // Google API Key của bạn

  const askGemini = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Xử lý dữ liệu đầu ra từ API
      const result = response.data.candidates[0].content.parts[0].text;
      setAnswer(result); // Cập nhật câu trả lời
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Xử lý lỗi từ Axios
        console.error("Axios error:", error.response?.data || error.message);
        setAnswer(
          "Failed to get response from Gemini: " +
            (error.response?.data.error.message || error.message)
        );
      } else {
        // Xử lý lỗi không phải từ Axios
        console.error("Unexpected error:", error);
        setAnswer("An unexpected error occurred.");
      }
    } finally {
      setLoading(false); // Tắt loading
    }
  };

  return (
    <div className="gemini-container">
    
      <div className="mb-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border p-2 w-full"
          placeholder="Type your question..."
        />
      </div>
      <button
        onClick={askGemini}
        className="bg-green-500 text-white p-2"
        disabled={loading || !question.trim()}
      >
        {loading ? "Asking..." : "Ask "}
      </button>
      {answer && (
        <div className="mt-4 p-4 border rounded bg-gray-100 overflow-auto max-h-96">
          <strong>Answer:</strong>
          <pre className="whitespace-pre-wrap break-words">{answer}</pre>
        </div>
      )}
    </div>
  );
};

export default GoogleGeminiButton;
