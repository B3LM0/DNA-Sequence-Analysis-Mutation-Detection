import { useState } from 'react';
import SingleSequenceAnalysis from './components/SingleSequenceAnalysis';
import TwoSequenceComparison from './components/TwoSequenceComparison';
import { Dna } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'single' | 'comparison'>('single');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Dna className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Bioinformatics DNA Analysis
            </h1>
          </div>
        </header>

        <div className="mb-6">
          <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('single')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Single Sequence
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'comparison'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Sequence Comparison
            </button>
          </div>
        </div>

        <main>
          {activeTab === 'single' ? (
            <SingleSequenceAnalysis />
          ) : (
            <TwoSequenceComparison />
          )}
        </main>

        <footer className="mt-12 text-center text-sm text-gray-600">
          <p>BENYAHIA Boualem - Bioinformatics TP Project</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
