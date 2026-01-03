"""
DNA sequence comparison and mutation detection module
"""
from typing import List, Tuple
from translation import translate_dna


def align_sequences(seq1: str, seq2: str) -> dict:
    """
    Simple pairwise alignment of two DNA sequences
    Detects substitutions, insertions, and deletions

    Args:
        seq1: First DNA sequence (reference)
        seq2: Second DNA sequence (variant)

    Returns:
        Dictionary with alignment information and mutations
    """
    seq1 = seq1.upper()
    seq2 = seq2.upper()

    len1 = len(seq1)
    len2 = len(seq2)

    mutations = []
    alignment_string = []

    if len1 == len2:
        for i in range(len1):
            if seq1[i] == seq2[i]:
                alignment_string.append('|')
            else:
                alignment_string.append('*')
                mutations.append({
                    'type': 'substitution',
                    'position': i,
                    'reference': seq1[i],
                    'variant': seq2[i]
                })
    else:
        length_diff = abs(len1 - len2)

        if len1 < len2:
            mutations.append({
                'type': 'insertion',
                'position': len1,
                'length': length_diff,
                'sequence': seq2[len1:]
            })

            for i in range(len1):
                if seq1[i] == seq2[i]:
                    alignment_string.append('|')
                else:
                    alignment_string.append('*')
                    mutations.append({
                        'type': 'substitution',
                        'position': i,
                        'reference': seq1[i],
                        'variant': seq2[i]
                    })

            alignment_string.extend([' '] * length_diff)

        else:
            mutations.append({
                'type': 'deletion',
                'position': len2,
                'length': length_diff,
                'sequence': seq1[len2:]
            })

            for i in range(len2):
                if seq1[i] == seq2[i]:
                    alignment_string.append('|')
                else:
                    alignment_string.append('*')
                    mutations.append({
                        'type': 'substitution',
                        'position': i,
                        'reference': seq1[i],
                        'variant': seq2[i]
                    })

    return {
        'seq1': seq1,
        'seq2': seq2,
        'alignment': ''.join(alignment_string),
        'mutations': mutations,
        'mutation_count': len(mutations),
        'length_seq1': len1,
        'length_seq2': len2
    }


def classify_mutations(mutations: List[dict]) -> dict:
    """
    Classify mutations by type

    Args:
        mutations: List of mutation dictionaries

    Returns:
        Dictionary with mutation counts by type
    """
    classification = {
        'substitutions': 0,
        'insertions': 0,
        'deletions': 0
    }

    for mutation in mutations:
        mut_type = mutation['type']
        if mut_type == 'substitution':
            classification['substitutions'] += 1
        elif mut_type == 'insertion':
            classification['insertions'] += 1
        elif mut_type == 'deletion':
            classification['deletions'] += 1

    return classification


def compare_proteins(seq1: str, seq2: str) -> dict:
    """
    Translate both sequences and compare the resulting proteins

    Args:
        seq1: First DNA sequence
        seq2: Second DNA sequence

    Returns:
        Dictionary with protein comparison
    """
    protein1 = translate_dna(seq1)
    protein2 = translate_dna(seq2)

    prot_seq1 = protein1['protein']
    prot_seq2 = protein2['protein']

    protein_mutations = []

    min_len = min(len(prot_seq1), len(prot_seq2))

    for i in range(min_len):
        if prot_seq1[i] != prot_seq2[i]:
            protein_mutations.append({
                'position': i,
                'reference': prot_seq1[i],
                'variant': prot_seq2[i]
            })

    if len(prot_seq1) != len(prot_seq2):
        if len(prot_seq1) < len(prot_seq2):
            protein_mutations.append({
                'type': 'insertion',
                'position': len(prot_seq1),
                'sequence': prot_seq2[len(prot_seq1):]
            })
        else:
            protein_mutations.append({
                'type': 'deletion',
                'position': len(prot_seq2),
                'sequence': prot_seq1[len(prot_seq2):]
            })

    return {
        'protein1': prot_seq1,
        'protein2': prot_seq2,
        'protein_mutations': protein_mutations,
        'translation1': protein1,
        'translation2': protein2
    }


def compare_sequences(seq1: str, seq2: str) -> dict:
    """
    Complete comparison of two DNA sequences

    Args:
        seq1: First DNA sequence (reference)
        seq2: Second DNA sequence (variant)

    Returns:
        Dictionary with complete comparison results
    """
    alignment = align_sequences(seq1, seq2)
    mutation_classification = classify_mutations(alignment['mutations'])
    protein_comparison = compare_proteins(seq1, seq2)

    return {
        'alignment': alignment,
        'mutation_classification': mutation_classification,
        'protein_comparison': protein_comparison
    }
