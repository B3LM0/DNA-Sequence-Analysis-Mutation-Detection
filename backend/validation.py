"""
FASTA and DNA sequence validation module
"""

def parse_fasta(fasta_text: str) -> dict:
    """
    Parse FASTA format and extract sequence information

    Args:
        fasta_text: String containing FASTA formatted sequence

    Returns:
        dict with 'header' and 'sequence' keys

    Raises:
        ValueError: If FASTA format is invalid
    """
    lines = fasta_text.strip().split('\n')

    if not lines:
        raise ValueError("Empty input")

    if not lines[0].startswith('>'):
        raise ValueError("FASTA format must start with '>' character")

    header = lines[0][1:].strip()

    if not header:
        raise ValueError("FASTA header cannot be empty")

    sequence_lines = [line.strip() for line in lines[1:] if line.strip()]

    if not sequence_lines:
        raise ValueError("No sequence found after header")

    sequence = ''.join(sequence_lines).upper()

    return {
        'header': header,
        'sequence': sequence
    }


def validate_dna_sequence(sequence: str) -> bool:
    """
    Validate that sequence contains only valid DNA nucleotides (A, T, C, G)

    Args:
        sequence: DNA sequence string

    Returns:
        True if valid

    Raises:
        ValueError: If invalid characters found
    """
    valid_chars = set('ATCG')
    sequence_upper = sequence.upper()

    invalid_chars = set(sequence_upper) - valid_chars

    if invalid_chars:
        raise ValueError(f"Invalid DNA characters found: {', '.join(sorted(invalid_chars))}")

    return True


def validate_fasta_dna(fasta_text: str) -> dict:
    """
    Parse and validate FASTA format DNA sequence

    Args:
        fasta_text: FASTA formatted text

    Returns:
        dict with header and sequence
    """
    parsed = parse_fasta(fasta_text)
    validate_dna_sequence(parsed['sequence'])
    return parsed
