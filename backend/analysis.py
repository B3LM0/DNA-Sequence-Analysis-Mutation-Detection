"""
DNA sequence analysis module
"""
from typing import List, Tuple

def count_nucleotides(sequence: str) -> dict:
    """
    Count occurrences of each nucleotide in the sequence

    Args:
        sequence: DNA sequence string

    Returns:
        Dictionary with counts for A, T, C, G
    """
    sequence = sequence.upper()
    return {
        'A': sequence.count('A'),
        'T': sequence.count('T'),
        'C': sequence.count('C'),
        'G': sequence.count('G')
    }


def calculate_percentages(sequence: str) -> dict:
    """
    Calculate GC% and AT% of the sequence

    Args:
        sequence: DNA sequence string

    Returns:
        Dictionary with gc_percent and at_percent
    """
    counts = count_nucleotides(sequence)
    total = len(sequence)

    if total == 0:
        return {'gc_percent': 0.0, 'at_percent': 0.0}

    gc_percent = ((counts['G'] + counts['C']) / total) * 100
    at_percent = ((counts['A'] + counts['T']) / total) * 100

    return {
        'gc_percent': round(gc_percent, 2),
        'at_percent': round(at_percent, 2)
    }


def reverse_complement(sequence: str) -> str:
    """
    Generate the reverse complement of a DNA sequence

    Args:
        sequence: DNA sequence string

    Returns:
        Reverse complement sequence
    """
    complement_map = {
        'A': 'T',
        'T': 'A',
        'C': 'G',
        'G': 'C'
    }

    sequence = sequence.upper()
    complement = ''.join(complement_map[base] for base in sequence)
    return complement[::-1]


def split_into_codons(sequence: str) -> List[str]:
    """
    Split DNA sequence into codons (triplets)

    Args:
        sequence: DNA sequence string

    Returns:
        List of codon strings
    """
    sequence = sequence.upper()
    codons = []

    for i in range(0, len(sequence), 3):
        codon = sequence[i:i+3]
        if len(codon) == 3:
            codons.append(codon)

    return codons


def find_start_stop_codons(sequence: str) -> dict:
    """
    Find positions of start (ATG) and stop codons (TAA, TAG, TGA)

    Args:
        sequence: DNA sequence string

    Returns:
        Dictionary with lists of start and stop codon positions
    """
    sequence = sequence.upper()
    start_codon = 'ATG'
    stop_codons = {'TAA', 'TAG', 'TGA'}

    start_positions = []
    stop_positions = []

    for i in range(0, len(sequence) - 2):
        codon = sequence[i:i+3]
        if codon == start_codon:
            start_positions.append(i)
        elif codon in stop_codons:
            stop_positions.append({'position': i, 'codon': codon})

    return {
        'start_codons': start_positions,
        'stop_codons': stop_positions
    }


def detect_orfs(sequence: str) -> List[dict]:
    """
    Detect Open Reading Frames (ORFs) in the sequence
    An ORF starts with ATG and ends with a stop codon (TAA, TAG, TGA)

    Args:
        sequence: DNA sequence string

    Returns:
        List of ORF dictionaries with start, end, length, and sequence
    """
    sequence = sequence.upper()
    stop_codons = {'TAA', 'TAG', 'TGA'}
    orfs = []

    for frame in range(3):
        i = frame
        while i < len(sequence) - 2:
            codon = sequence[i:i+3]

            if codon == 'ATG':
                start = i
                j = i + 3

                while j < len(sequence) - 2:
                    stop_codon = sequence[j:j+3]
                    if stop_codon in stop_codons:
                        end = j + 3
                        orf_sequence = sequence[start:end]
                        orfs.append({
                            'frame': frame,
                            'start': start,
                            'end': end,
                            'length': len(orf_sequence),
                            'sequence': orf_sequence
                        })
                        i = j + 3
                        break
                    j += 3
                else:
                    i += 3
            else:
                i += 3

    return orfs


def analyze_sequence(sequence: str) -> dict:
    """
    Perform complete analysis on a DNA sequence

    Args:
        sequence: DNA sequence string

    Returns:
        Dictionary with all analysis results
    """
    return {
        'length': len(sequence),
        'nucleotide_counts': count_nucleotides(sequence),
        'percentages': calculate_percentages(sequence),
        'reverse_complement': reverse_complement(sequence),
        'codons': split_into_codons(sequence),
        'start_stop_codons': find_start_stop_codons(sequence),
        'orfs': detect_orfs(sequence)
    }
