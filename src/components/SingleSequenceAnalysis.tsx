import { useState } from 'react';
import { Upload, Dna } from 'lucide-react';

const API_URL = 'http://localhost:8000';

interface AnalysisResult {
  success: boolean;
  header: string;
  sequence: string;
  analysis: {
    length: number;
    nucleotide_counts: { A: number; T: number; C: number; G: number };
    percentages: { gc_percent: number; at_percent: number };
    reverse_complement: string;
    codons: string[];
    start_stop_codons: {
      start_codons: number[];
      stop_codons: Array<{ position: number; codon: string }>;
    };
    orfs: Array<{
      frame: number;
      start: number;
      end: number;
      length: number;
      sequence: string;
    }>;
  };
  translated_orfs: Array<{
    frame: number;
    start: number;
    end: number;
    length: number;
    sequence: string;
    translation: {
      protein: string;
      codons: string[];
    };
  }>;
  full_translation: {
    protein: string;
    codons: string[];
  };
}

export default function SingleSequenceAnalysis() {
  const [fastaInput, setFastaInput] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fasta_text: fastaInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Analysis failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'File upload failed');
      }

      setFastaInput(data.fasta_text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Dna className="w-6 h-6" />
          Single DNA Sequence Analysis
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter FASTA sequence:
            </label>
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`>Sequence_Name\nATGCGTACGTAGCTAGCTAG...`}
              value={fastaInput}
              onChange={(e) => setFastaInput(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={loading || !fastaInput}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze Sequence'}
            </button>

            <label className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload FASTA File
              <input
                type="file"
                accept=".fasta,.fa,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Sequence Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Header:</span> {result.header}</p>
              <p><span className="font-medium">Length:</span> {result.analysis.length} bp</p>
              <div className="mt-2">
                <p className="font-medium mb-1">Sequence:</p>
                <div className="p-3 bg-gray-50 rounded font-mono text-xs break-all">
                  {result.sequence}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Nucleotide Composition</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-700">
                  {result.analysis.nucleotide_counts.A}
                </div>
                <div className="text-sm text-gray-600">Adenine (A)</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-700">
                  {result.analysis.nucleotide_counts.T}
                </div>
                <div className="text-sm text-gray-600">Thymine (T)</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-700">
                  {result.analysis.nucleotide_counts.C}
                </div>
                <div className="text-sm text-gray-600">Cytosine (C)</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-yellow-700">
                  {result.analysis.nucleotide_counts.G}
                </div>
                <div className="text-sm text-gray-600">Guanine (G)</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {result.analysis.percentages.gc_percent}%
                </div>
                <div className="text-sm text-gray-600">GC Content</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {result.analysis.percentages.at_percent}%
                </div>
                <div className="text-sm text-gray-600">AT Content</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Reverse Complement</h3>
            <div className="p-3 bg-gray-50 rounded font-mono text-xs break-all">
              {result.analysis.reverse_complement}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Codons</h3>
            <div className="flex flex-wrap gap-2">
              {result.analysis.codons.map((codon, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono text-sm"
                >
                  {codon}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Start & Stop Codons</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">
                  Start Codons (ATG): {result.analysis.start_stop_codons.start_codons.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.start_stop_codons.start_codons.map((pos, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      Position {pos}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">
                  Stop Codons: {result.analysis.start_stop_codons.stop_codons.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.start_stop_codons.stop_codons.map((stop, idx) => (
                    <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                      {stop.codon} at {stop.position}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Open Reading Frames (ORFs): {result.translated_orfs.length}
            </h3>
            {result.translated_orfs.length > 0 ? (
              <div className="space-y-4">
                {result.translated_orfs.map((orf, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-sm">
                      <span><strong>Frame:</strong> {orf.frame}</span>
                      <span><strong>Start:</strong> {orf.start}</span>
                      <span><strong>End:</strong> {orf.end}</span>
                      <span><strong>Length:</strong> {orf.length} bp</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">DNA:</p>
                        <div className="p-2 bg-white rounded font-mono text-xs break-all">
                          {orf.sequence}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Protein:</p>
                        <div className="p-2 bg-white rounded font-mono text-xs break-all">
                          {orf.translation.protein}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No ORFs detected</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Full Translation</h3>
            <div className="p-3 bg-gray-50 rounded font-mono text-xs break-all">
              {result.full_translation.protein}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
