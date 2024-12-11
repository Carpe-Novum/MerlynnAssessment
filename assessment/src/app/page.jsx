// This is the model select home page

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/models')
      .then((res) => res.json())
      .then((data) => setModels(data.modelDetails));
  }, []);

  const handleModelSelection = () => {
    if (selectedModel) {
      router.push(`/model/${selectedModel}`);
    } else {
      alert('Please select a model.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">TOM Models</h1>
        <h2 className="text-xl font-semibold mb-6 text-gray-700">Select a Model</h2>

        <div className="space-y-4">
          <select
            className="w-64 px-4 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="" disabled>Select a model...</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleModelSelection}
            className="w-64 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Select Model
          </button>
        </div>
      </div>
    </div>
  );
}

