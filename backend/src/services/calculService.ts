export class CalculService {
  static calculateLineAmount(quantite: number, prixUnitaire: number, remise: number, isRemisePercentage: boolean): number {
    let montant = quantite * prixUnitaire;
    if (isRemisePercentage) {
      montant = montant * (1 - remise / 100);
    } else {
      montant = montant - remise;
    }
    return Math.round(montant * 100) / 100;
  }

  static calculateTotals(lines: Array<{ montant_ht: number }>): {
    totalHT: number;
    montantTVA: number;
    totalTTC: number;
  } {
    const totalHT = lines.reduce((sum, line) => sum + line.montant_ht, 0);
    const montantTVA = Math.round((totalHT * 0.2) * 100) / 100;
    const totalTTC = Math.round((totalHT + montantTVA) * 100) / 100;

    return {
      totalHT: Math.round(totalHT * 100) / 100,
      montantTVA,
      totalTTC,
    };
  }

  static convertNumberToLetters(num: number): string {
    const ones = ['', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf'];
    const tens = ['', '', 'Vingt', 'Trente', 'Quarante', 'Cinquante', 'Soixante', 'Soixante-dix', 'Quatre-vingt', 'Quatre-vingt-dix'];
    const scales = ['', 'Mille', 'Million', 'Milliard', 'Billion'];

    if (num === 0) return 'Zéro';

    const parts: string[] = [];
    let scaleIndex = 0;

    while (num > 0 && scaleIndex < scales.length) {
      const part = num % 1000;
      if (part !== 0) {
        parts.unshift(`${this.convertHundreds(part, ones, tens)} ${scales[scaleIndex]}`.trim());
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return parts.join(' ') + ' Ariary';
  }

  private static convertHundreds(num: number, ones: string[], tens: string[]): string {
    let result = '';
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;

    if (hundreds > 0) {
      result += ones[hundreds] + ' Cent';
    }

    if (remainder > 0) {
      if (result) result += ' ';
      if (remainder < 10) {
        result += ones[remainder];
      } else if (remainder < 20) {
        result += ['Dix', 'Onze', 'Douze', 'Treize', 'Quatorze', 'Quinze', 'Seize', 'Dix-sept', 'Dix-huit', 'Dix-neuf'][remainder - 10];
      } else {
        result += tens[Math.floor(remainder / 10)];
        if (remainder % 10 > 0) {
          result += '-' + ones[remainder % 10];
        }
      }
    }

    return result;
  }
}
