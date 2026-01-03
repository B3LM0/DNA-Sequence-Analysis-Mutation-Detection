"""
DNA to protein translation module using the standard genetic code
"""

GENETIC_CODE = {
    'TTT': 'F', 'TTC': 'F', 'TTA': 'L', 'TTG': 'L',
    'TCT': 'S', 'TCC': 'S', 'TCA': 'S', 'TCG': 'S',
    'TAT': 'Y', 'TAC': 'Y', 'TAA': '*', 'TAG': '*',
    'TGT': 'C', 'TGC': 'C', 'TGA': '*', 'TGG': 'W',
    'CTT': 'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L',
    'CCT': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P',
    'CAT': 'H', 'CAC': 'H', 'CAA': 'Q', 'CAG': 'Q',
    'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R',
    'ATT': 'I', 'ATC': 'I', 'ATA': 'I', 'ATG': 'M',
    'ACT': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
    'AAT': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K',
    'AGT': 'S', 'AGC': 'S', 'AGA': 'R', 'AGG': 'R',
    'GTT': 'V', 'GTC': 'V', 'GTA': 'V', 'GTG': 'V',
    'GCT': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
    'GAT': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E',
    'GGT': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G'
}


def translate_codon(codon: str) -> str:
    """
    Translate a single codon to amino acid

    Args:
        codon: Three nucleotide string

    Returns:
        Single letter amino acid code or '*' for stop codon
    """
    codon = codon.upper()
    if len(codon) != 3:
        return '?'
    return GENETIC_CODE.get(codon, '?')


def translate_dna(sequence: str, start_position: int = 0) -> dict:
    """
    Translate DNA sequence to protein sequence

    Args:
        sequence: DNA sequence string
        start_position: Starting position for translation (default 0)

    Returns:
        Dictionary with protein sequence and codon mapping
    """
    sequence = sequence.upper()

    if start_position >= len(sequence):
        return {'protein': '', 'codons': [], 'codon_map': []}

    sequence = sequence[start_position:]

    protein = []
    codons = []
    codon_map = []

    for i in range(0, len(sequence) - 2, 3):
        codon = sequence[i:i+3]
        if len(codon) == 3:
            amino_acid = translate_codon(codon)
            codons.append(codon)
            protein.append(amino_acid)
            codon_map.append({
                'codon': codon,
                'amino_acid': amino_acid,
                'position': i
            })

            if amino_acid == '*':
                break

    return {
        'protein': ''.join(protein),
        'codons': codons,
        'codon_map': codon_map
    }


def translate_orfs(orfs: list) -> list:
    """
    Translate all ORFs to protein sequences

    Args:
        orfs: List of ORF dictionaries from analysis.detect_orfs

    Returns:
        List of ORFs with added translation information
    """
    translated_orfs = []

    for orf in orfs:
        translation = translate_dna(orf['sequence'])
        translated_orf = orf.copy()
        translated_orf['translation'] = translation
        translated_orfs.append(translated_orf)

    return translated_orfs
