import React, { useState } from "react";
import axios from "axios";

const GoogleGeminiButton: React.FC = () => {
  const [question, setQuestion] = useState<string>(""); // Câu hỏi từ người dùng
  const [answer, setAnswer] = useState<string>(""); // Câu trả lời từ API
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || ""; // Google API Key từ biến môi trường

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
      <h2 className="text-xl font-bold mb-4">Ask Google Gemini</h2>
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
        {loading ? "Asking..." : "Ask Gemini"}
      </button>
      {answer && (
        <div className="mt-4 p-4 border rounded bg-gray-100 overflow-auto max-h-96">
          <strong className="block text-lg font-semibold mb-2">Answer:</strong>
          <div className="answer-content">
            <div dangerouslySetInnerHTML={{ __html: formatAnswer(answer) }} />
          </div>
        </div>
      )}
    </div>
  );
};

// Function to format the response content into HTML
const formatAnswer = (text: string): string => {
  // Replace line breaks with <br> tags
  let formattedText = text.replace(/\n/g, "<br>");

  // Replace bullet points with HTML list items
  formattedText = formattedText.replace(/(\* .+)/g, "<li>$1</li>");

  // Replace sections with headings
  formattedText = formattedText.replace(/(\*\*.+\*\*)/g, "<h3>$1</h3>");

  // Wrap list items in <ul> tags
  formattedText = formattedText.replace(/(<li>.+<\/li>)+/g, "<ul>$&</ul>");

  // Replace bold text
  formattedText = formattedText.replace(
    /\*\*(.+?)\*\*/g,
    "<strong>$1</strong>"
  );

  // Replace italic text
  formattedText = formattedText.replace(/\*(.+?)\*/g, "<em>$1</em>");

  return formattedText;
};

export default GoogleGeminiButton;
