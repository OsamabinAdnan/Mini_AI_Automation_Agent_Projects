'use client';

import { useState, useEffect } from 'react';
import { MeetingSummary } from '../types';
import { BACKEND_URL } from '../config';

export default function MeetingNotesProcessor() {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<MeetingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  // Fetch available providers on component mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/providers`);
        if (response.ok) {
          const data = await response.json();
          // data.providers is ['openrouter', 'qwen', 'cohere']
          setProviders(data.providers);
          if (data.providers.length > 0) {
            setSelectedProvider(data.providers[0]); // Select first provider by default
          }
        }
      } catch (err) {
        console.error('Failed to fetch providers:', err);
      }
    };

    fetchProviders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requestBody: { transcript: string; provider?: string } = { transcript };

      if (selectedProvider) {
        requestBody.provider = selectedProvider;
      }

      const response = await fetch(`${BACKEND_URL}/process-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Meeting Notes Processor</h1>
        <p className="text-lg text-gray-600">
          Paste your meeting transcript below and get structured action items automatically
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="transcript" className="block text-lg font-medium text-gray-700 mb-2">
            Meeting Transcript
          </label>
          <textarea
            id="transcript"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white text-black"
            placeholder="Paste your meeting transcript here..."
          />
        </div>

        {/* Provider Selection */}
        {providers.length > 0 && (
          <div>
            <label htmlFor="provider" className="block text-lg font-medium text-gray-700 mb-2">
              AI Provider
            </label>
            <select
              id="provider"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
            >
              <option value="">Auto-select (uses first available)</option>
              {providers.map((providerName, index) => (
                <option key={index} value={providerName}>
                  {providerName.charAt(0).toUpperCase() + providerName.slice(1)}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              If the selected provider fails, the system will automatically try other configured providers.
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading || !transcript.trim()}
            className={`px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              loading || !transcript.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Extract Action Items'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-12 space-y-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Meeting Summary</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-700 whitespace-pre-wrap">{result.summary}</p>
            </div>
          </div>

          {/* Action Items Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-yellow-50 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Action Items</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {result.action_items.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {result.action_items.map((item, index) => (
                    <li key={index} className="py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-1">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{item.task}</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {item.owner !== 'TBD' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Owner: {item.owner}
                              </span>
                            )}
                            {item.deadline !== 'TBD' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Due: {item.deadline}
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.priority === 'high' ? 'bg-red-100 text-red-800' :
                              item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              Priority: {item.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No action items found in the meeting.</p>
              )}
            </div>
          </div>

          {/* Decisions Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-purple-50 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Decisions Made</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {result.decisions.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {result.decisions.map((decision, index) => (
                    <li key={index} className="text-gray-700">{decision}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No decisions were made in the meeting.</p>
              )}
            </div>
          </div>

          {/* Attendees Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Attendees</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {result.attendees.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.attendees.map((attendee, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {attendee}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No attendees were identified in the meeting.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}