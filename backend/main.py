"""
FastAPI backend for bioinformatics DNA sequence analysis
"""
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

import validation
import analysis
import translation
import mutation

app = FastAPI(title="Bioinformatics DNA Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FASTAInput(BaseModel):
    fasta_text: str


class TwoSequenceInput(BaseModel):
    fasta_text1: str
    fasta_text2: str


@app.get("/")
def read_root():
    return {
        "message": "Bioinformatics DNA Analysis API",
        "endpoints": {
            "POST /analyze": "Analyze single DNA sequence",
            "POST /compare": "Compare two DNA sequences",
            "POST /upload": "Upload FASTA file"
        }
    }


@app.post("/analyze")
def analyze_dna_sequence(input_data: FASTAInput):
    """
    Analyze a single DNA sequence in FASTA format

    Returns:
        - Sequence information
        - Nucleotide counts and percentages
        - Reverse complement
        - Codons
        - Start/stop codons
        - ORFs
        - Translation
    """
    try:
        parsed = validation.validate_fasta_dna(input_data.fasta_text)

        sequence = parsed['sequence']
        header = parsed['header']

        analysis_results = analysis.analyze_sequence(sequence)

        orfs = analysis_results['orfs']
        translated_orfs = translation.translate_orfs(orfs)

        full_translation = translation.translate_dna(sequence)

        return {
            "success": True,
            "header": header,
            "sequence": sequence,
            "analysis": analysis_results,
            "translated_orfs": translated_orfs,
            "full_translation": full_translation
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@app.post("/compare")
def compare_dna_sequences(input_data: TwoSequenceInput):
    """
    Compare two DNA sequences in FASTA format

    Returns:
        - Alignment visualization
        - Mutation detection and classification
        - Protein comparison
    """
    try:
        parsed1 = validation.validate_fasta_dna(input_data.fasta_text1)
        parsed2 = validation.validate_fasta_dna(input_data.fasta_text2)

        seq1 = parsed1['sequence']
        seq2 = parsed2['sequence']
        header1 = parsed1['header']
        header2 = parsed2['header']

        comparison_results = mutation.compare_sequences(seq1, seq2)

        return {
            "success": True,
            "sequence1": {
                "header": header1,
                "sequence": seq1
            },
            "sequence2": {
                "header": header2,
                "sequence": seq2
            },
            "comparison": comparison_results
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@app.post("/upload")
async def upload_fasta_file(file: UploadFile = File(...)):
    """
    Upload a FASTA file and return its contents
    """
    try:
        contents = await file.read()
        fasta_text = contents.decode('utf-8')

        parsed = validation.validate_fasta_dna(fasta_text)

        return {
            "success": True,
            "filename": file.filename,
            "header": parsed['header'],
            "sequence": parsed['sequence'],
            "fasta_text": fasta_text
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
