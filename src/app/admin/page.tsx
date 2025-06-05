"use client";
import { useEffect, useState } from "react";

interface ResponseData {
  id: string;
  name: string;
  phone: string;
  email: string;
  occupation: string;
  createdAt: string;
}

export default function AdminResponsesPage() {
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/responses")
      .then((res) => res.json())
      .then((data) => {
        setResponses(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load responses");
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Demo Requests</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && responses.length === 0 && <p>No responses yet.</p>}
      {!loading && !error && responses.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Occupation</th>
                <th className="py-2 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((r) => (
                <tr key={r.id} className="even:bg-gray-50">
                  <td className="py-2 px-4 border-b">{r.name}</td>
                  <td className="py-2 px-4 border-b">{r.phone}</td>
                  <td className="py-2 px-4 border-b">{r.email}</td>
                  <td className="py-2 px-4 border-b">{r.occupation}</td>
                  <td className="py-2 px-4 border-b text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 