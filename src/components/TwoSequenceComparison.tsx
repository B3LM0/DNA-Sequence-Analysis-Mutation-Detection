import { useState } from 'react';
import { GitCompare } from 'lucide-react';

const API_URL = 'http://localhost:8000';

interface ComparisonResult {
  success: boolean;
  sequence1: {
    header: string;
    sequence: string;
  };
  sequence2: {
    header: string;
    sequence: string;
  };
  comparison: {
    alignment: {
      seq1: string;
      seq2: string;
      alignment: string;
      mutations: Array<{
        type: string;
        position: number;
        reference?: string;
        variant?: string;
        length?: number;
        sequence?: string;
      }>;
      mutation_count: number;
      length_seq1: number;
      length_seq2: number;
    };
    mutation_classification: {
      substitutions: number;
      insertions: number;
      deletions: number;
    };
    protein_comparison: {
      protein1: string;
      protein2: string;
      protein_mutations: Array<{
        position?: number;
        reference?: string;
        variant?: string;
        type?: string;
        sequence?: string;
      }>;
    };
  };
}

export default function TwoSequenceComparison() {
  const [fasta1, setFasta1] = useState('');
  const [fasta2, setFasta2] = useState('');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fasta_text1: fasta1,
          fasta_text2: fasta2,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Comparison failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderAlignment = () => {
    if (!result) return null;

    const { seq1, seq2, alignment } = result.comparison.alignment;
    const chunkSize = 60;
    const chunks = [];

    for (let i = 0; i < Math.max(seq1.length, seq2.length); i += chunkSize) {
      chunks.push({
        seq1: seq1.slice(i, i + chunkSize),
        align: alignment.slice(i, i + chunkSize),
        seq2: seq2.slice(i, i + chunkSize),
        start: i,
      });
    }

    return (
      <div className="space-y-4">
        {chunks.map((chunk, idx) => (
          <div key={idx} className="font-mono text-xs">
            <div className="flex gap-2">
              <span className="text-gray-500 w-12 text-right">{chunk.start}</span>
              <span className="text-green-700">{chunk.seq1}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-12"></span>
              <span className="text-gray-500">{chunk.align}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-12 text-right">{chunk.start}</span>
              <span className="text-blue-700">{chunk.seq2}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <GitCompare className="w-6 h-6" />
          Two Sequence Comparison
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Sequence (FASTA):
            </label>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={`>Reference_Sequence\nATGCGTACGTAGCTAGCTAG...`}
              value={fasta1}
              onChange={(e) => setFasta1(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variant Sequence (FASTA):
            </label>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`>Variant_Sequence\nATGCGTACGTAGCAAGCTAG...`}
              value={fasta2}
              onChange={(e) => setFasta2(e.target.value)}
            />
          </div>

          <button
            onClick={handleCompare}
            disabled={loading || !fasta1 || !fasta2}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Comparing...' : 'Compare Sequences'}
          </button>

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
            <div className="space-y-3">
              <div>
                <p className="font-medium text-green-700">Reference: {result.sequence1.header}</p>
                <p className="text-sm text-gray-600">Length: {result.comparison.alignment.length_seq1} bp</p>
              </div>
              <div>
                <p className="font-medium text-blue-700">Variant: {result.sequence2.header}</p>
                <p className="text-sm text-gray-600">Length: {result.comparison.alignment.length_seq2} bp</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Mutation Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-700">
                  {result.comparison.alignment.mutation_count}
                </div>
                <div className="text-sm text-gray-600">Total Mutations</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-orange-700">
                  {result.comparison.mutation_classification.substitutions}
                </div>
                <div className="text-sm text-gray-600">Substitutions</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-700">
                  {result.comparison.mutation_classification.insertions}
                </div>
                <div className="text-sm text-gray-600">Insertions</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-700">
                  {result.comparison.mutation_classification.deletions}
                </div>
                <div className="text-sm text-gray-600">Deletions</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Detailed Mutations</h3>
            {result.comparison.alignment.mutations.length > 0 ? (
              <div className="space-y-2">
                {result.comparison.alignment.mutations.map((mut, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center gap-4 text-sm">
                    <span className={`px-2 py-1 rounded font-medium ${
                      mut.type === 'substitution' ? 'bg-orange-100 text-orange-800' :
                      mut.type === 'insertion' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {mut.type.toUpperCase()}
                    </span>
                    <span className="text-gray-700">Position: {mut.position}</span>
                    {mut.reference && mut.variant && (
                      <span className="font-mono">
                        {mut.reference} → {mut.variant}
                      </span>
                    )}
                    {mut.length && (
                      <span>Length: {mut.length} bp</span>
                    )}
                    {mut.sequence && (
                      <span className="font-mono text-xs bg-white px-2 py-1 rounded">
                        {mut.sequence}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No mutations detected</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Sequence Alignment</h3>
            <div className="p-4 bg-gray-50 rounded-lg overflow-x-auto">
              <p className="text-xs text-gray-600 mb-3">
                Legend: | = match, * = mismatch
              </p>
              {renderAlignment()}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Protein Translation Comparison</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Reference Protein:</p>
                <div className="p-3 bg-green-50 rounded font-mono text-xs break-all">
                  {result.comparison.protein_comparison.protein1}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Variant Protein:</p>
                <div className="p-3 bg-blue-50 rounded font-mono text-xs break-all">
                  {result.comparison.protein_comparison.protein2}
                </div>
              </div>

              {result.comparison.protein_comparison.protein_mutations.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Protein Mutations:</p>
                  <div className="space-y-2">
                    {result.comparison.protein_comparison.protein_mutations.map((mut, idx) => (
                      <div key={idx} className="p-3 bg-red-50 rounded text-sm">
                        {mut.position !== undefined && mut.reference && mut.variant ? (
                          <>Position {mut.position}: {mut.reference} → {mut.variant}</>
                        ) : (
                          <>{mut.type}: {mut.sequence}</>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
