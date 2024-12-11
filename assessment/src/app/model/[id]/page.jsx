// This is the dynamic form page

'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ModelForm() {
  const { id } = useParams();
  const [model, setModel] = useState(null);
  const [decision, setDecision] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [fileId, setFileId] = useState(null);


  // Fetch the model details when the page loads
  useEffect(() => {
    fetch(`/api/models/${id}`)
      .then((res) => res.json())
      .then((data) => setModel(data.data))
      .catch((err) => console.error('Error fetching model:', err));
  }, [id]);

  if (!model) return <p>Loading...</p>; // Loading state for model data

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const inputData = Array.from(formData.entries()).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

    const payload = {
        data: {
          type: "scenario", 
          attributes: {
            input: inputData, 
          },
        },
      };
    
    // Send the form data to the backend API to get the decision
    try {
        const response = await fetch(`/api/decision/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload), 
        });

        const data = await response.json();
        const apiDecision = data.decision.attributes.decision;
        setDecision(apiDecision);
        const decision = apiDecision;
        // Save data to MongoDB
        await fetch('/api/decision/save', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                inputData,
                decision,
            }),
        });
    } catch (error) {
      console.error('Error submitting form data:', error);
    }

  };

  // Handle CSV file upload
  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      alert('Please upload a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await fetch(`/api/batch/${id}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.fileId) {
        setFileId(data.fileId);
        alert('CSV file uploaded successfully!');
      } else {
        alert('Error uploading CSV file.');
      }
    } catch (error) {
      console.error('Error uploading CSV file:', error);
    }
  };

  // Handle CSV download
  const handleCsvDownload = async () => {
    if (!fileId) {
        alert('No file ID available. Please upload a CSV file first.');
        return;
    }

    try {
        const response = await fetch(`/api/batch/${id}/${fileId}`, {
            method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to retrieve the processed file.');
    }

    // Create a Blob and download the file
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `processed_file_${fileId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    convertCSVBlobToJSON(blob)
  .then(async (json) => 
    {
        for (let i = 0; i < json.length; i++) { 
        const inputData = json[i].userInput;
        const decision = json[i].decision;
        await fetch('/api/decision/save', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                inputData,
                decision,
            }),
        });
        }
    })
  .catch((err) => console.error(err));
    
    alert('File downloaded successfully!');
    } catch (error) {
        console.error('Error downloading CSV file:', error);
        alert('Error downloading the processed file.');
    }
};

function convertCSVBlobToJSON(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      // Read the Blob as text
      reader.onload = function (e) {
        const csvText = e.target.result;
        const rows = csvText.split('\n');
        
        // Parse CSV text (assumes the first row is the header)
        const headers = rows[0].split('|').map(item => item.trim()); // Change delimiter if needed (e.g. semicolon)
        const data = [];
  
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i].split('|'); // Split each row by delimiter
          if (row.length === headers.length) {
            const obj = {};
            obj.userInput = {};
            for (let j = 0; j < headers.length; j++) {
             
              if (headers[j] == 'TOM Outcome'){
                obj['decision'] = row[j]
              }
              else if (headers[j] != 'Confidence' && headers[j] != 'Exclusion'){
                obj.userInput[headers[j]] = row[j]; // Map header to row values
              }
            }
            data.push(obj); // Push the row object to the data array
          }
        }
  
        resolve(data); // Resolve with the parsed JSON array
      };
  
      reader.onerror = function () {
        reject('Error reading the CSV file');
      };
  
      // Start reading the Blob as text
      reader.readAsText(blob);
    });
  }
  
  



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">{model.attributes.name}</h1>
        <p className="text-gray-600 mb-6">{model.attributes.description}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {model.attributes.metadata.attributes.map((attr, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="font-medium text-gray-700">{attr.question}</label>

              {attr.type === 'Nominal' ? (
                <select
                  name={attr.name}
                  className="w-full px-4 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue=""
                >
                  <option value="" disabled>Select...</option>
                  {attr.domain.values.map((val, i) => (
                    <option key={i} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              ) : attr.type === 'Continuous' ? (
                <input
                  type="number"
                  name={attr.name}
                  min={attr.domain.lower}
                  max={attr.domain.upper}
                  step={attr.domain.interval || 1}
                  className="w-full px-4 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-red-500">Unsupported attribute type</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Submit
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back
          </button>
        </form>

        {decision && (
          <div className="mt-6 p-4 bg-green-100 border border-green-500 rounded">
            <h3 className="text-green-700 font-bold mb-2">Decision:</h3>
            <p className="text-2xl text-gray-900 font-semibold">{decision}</p>
          </div>
        )}

        <form onSubmit={handleCsvUpload} className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Batch CSV Upload</h2>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
            className="w-full text-blue-600 font-medium"
          />

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Upload CSV
          </button>
        </form>

        {fileId && (
          <button
            type="button"
            onClick={handleCsvDownload}
            className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Download Processed File
          </button>
        )}
      </div>
    </div>
  );
}


