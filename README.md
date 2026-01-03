# Bioinformatics DNA Analysis - Teaching Project

A simple web application for analyzing DNA sequences in FASTA format. Built for educational purposes.

## Features

### Part 1 - Single DNA Sequence Analysis
- Accept DNA sequences in FASTA format (text input or file upload)
- Validate FASTA format and DNA characters (A, T, C, G)
- Compute:
  - Sequence length
  - Nucleotide counts (A, T, C, G)
  - GC% and AT%
  - Reverse complement
  - Split sequence into codons
  - Detect start codons (ATG) and stop codons (TAA, TAG, TGA)
  - Open Reading Frame (ORF) detection
  - DNA to protein translation using standard genetic code

### Part 2 - Two DNA Sequence Comparison
- Compare two DNA sequences
- Detect and classify mutations:
  - Substitutions
  - Insertions
  - Deletions
- Visual alignment display
- Compare translated protein sequences

### Part 3 - Visualization
- Text-based alignment view
- Color-coded nucleotides
- Mutation highlighting
- Protein sequence comparison

## Technology Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Python + FastAPI
- **No database required**

## Project Structure

```
project/
├── backend/               # Python FastAPI backend
│   ├── main.py           # FastAPI routes
│   ├── validation.py     # FASTA and DNA validation
│   ├── analysis.py       # Sequence analysis functions
│   ├── translation.py    # DNA to protein translation
│   ├── mutation.py       # Sequence comparison and mutation detection
│   └── requirements.txt  # Python dependencies
├── src/                  # React frontend
│   ├── components/
│   │   ├── SingleSequenceAnalysis.tsx
│   │   └── TwoSequenceComparison.tsx
│   └── App.tsx
├── examples/             # Example FASTA files
│   ├── example1_simple.fasta
│   ├── example2_with_orf.fasta
│   ├── example3_reference.fasta
│   ├── example4_variant.fasta
│   ├── example5_insulin.fasta
│   └── README.md
└── README.md
```

## Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 18+** (for frontend)
- **pip** (Python package manager)
- **npm** (Node package manager)

## Installation & Setup

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
python main.py
```

The backend will run on: **http://localhost:8000**

You can access the API documentation at: **http://localhost:8000/docs**

### 2. Frontend Setup

In a new terminal, navigate to the project root and install dependencies:

```bash
npm install
```

The frontend will automatically start and run on: **http://localhost:5173**

## Usage

### Single Sequence Analysis

1. Click on the **"Single Sequence"** tab
2. Enter a DNA sequence in FASTA format, or upload a FASTA file
3. Click **"Analyze Sequence"**
4. View the results including:
   - Nucleotide composition
   - GC/AT content
   - Reverse complement
   - Codons
   - Start/Stop codons
   - ORFs with translations
   - Full protein translation

### Two Sequence Comparison

1. Click on the **"Sequence Comparison"** tab
2. Enter two DNA sequences in FASTA format (reference and variant)
3. Click **"Compare Sequences"**
4. View the results including:
   - Mutation summary
   - Detailed mutation list
   - Visual alignment
   - Protein translation comparison

## Example FASTA Format

```
>Sequence_Name
ATGGCTAGCTAGCTAGCTAGCTAG
```

## Example Files

Example FASTA files are provided in the `examples/` directory:

- `example1_simple.fasta` - Simple short sequence
- `example2_with_orf.fasta` - Sequence with ORF
- `example3_reference.fasta` & `example4_variant.fasta` - Pair for comparison
- `example5_insulin.fasta` - Partial human insulin gene

## API Endpoints

### POST /analyze
Analyze a single DNA sequence

**Request:**
```json
{
  "fasta_text": ">Seq1\nATGCGT..."
}
```

### POST /compare
Compare two DNA sequences

**Request:**
```json
{
  "fasta_text1": ">Ref\nATGCGT...",
  "fasta_text2": ">Var\nATGTGT..."
}
```

### POST /upload
Upload a FASTA file

## Code Organization

### Backend Modules

- **validation.py**: FASTA parsing and DNA sequence validation
- **analysis.py**: Core sequence analysis (length, composition, ORFs, etc.)
- **translation.py**: DNA to protein translation using genetic code
- **mutation.py**: Sequence alignment and mutation detection

### Frontend Components

- **SingleSequenceAnalysis.tsx**: UI for single sequence analysis
- **TwoSequenceComparison.tsx**: UI for comparing two sequences
- **App.tsx**: Main application with tab navigation

## Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed: `python --version`
- Check all dependencies are installed: `pip list`
- Make sure port 8000 is not in use

### Frontend can't connect to backend
- Verify backend is running on http://localhost:8000
- Check browser console for CORS errors
- Ensure firewall isn't blocking connections

### Invalid FASTA format error
- Make sure sequence starts with `>` character
- Ensure header line is present
- Verify only A, T, C, G characters in sequence

## Educational Notes

This project demonstrates:

1. **FASTA format handling** - Standard format for biological sequences
2. **DNA sequence validation** - Ensuring data quality
3. **Bioinformatics algorithms**:
   - Nucleotide counting
   - GC content calculation
   - Reverse complement generation
   - ORF detection
   - Genetic code translation
   - Sequence alignment
   - Mutation detection
4. **Full-stack development** - Backend API + Frontend UI
5. **RESTful API design** - Clean separation of concerns

## License

This is an educational project for teaching purposes.

## Support

For questions or issues, please refer to the code comments or consult your instructor.
