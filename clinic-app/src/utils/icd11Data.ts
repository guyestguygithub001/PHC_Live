export interface ICD11Code {
  id: string;
  code: string;
  title: string;
  synonyms: string[];
}

export const primaryCareICD11: ICD11Code[] = [
  { id: '1', code: '1F40', title: 'Malaria', synonyms: ['plasmodium', 'fever'] },
  { id: '2', code: '1F40.0', title: 'Plasmodium falciparum malaria', synonyms: ['severe malaria', 'cerebral malaria'] },
  { id: '3', code: '1A07', title: 'Typhoid fever', synonyms: ['enteric fever', 'salmonella typhi'] },
  { id: '4', code: '1A00', title: 'Cholera', synonyms: ['severe watery diarrhea', 'vibrio cholerae'] },
  { id: '5', code: 'BA43', title: 'Essential hypertension', synonyms: ['high blood pressure', 'HBP'] },
  { id: '6', code: '5A11', title: 'Type 2 diabetes mellitus', synonyms: ['DM2', 'sugar disease'] },
  { id: '7', code: 'CA23', title: 'Asthma', synonyms: ['wheezing', 'breathlessness'] },
  { id: '8', code: '1D84', title: 'Lassa fever', synonyms: ['viral hemorrhagic fever'] },
  { id: '9', code: '1A40', title: 'Gastroenteritis', synonyms: ['diarrhea', 'vomiting', 'stomach bug'] },
  { id: '10', code: 'CA40', title: 'Pneumonia', synonyms: ['chest infection', 'cough'] },
  { id: '11', code: 'FA70', title: 'Osteoarthritis', synonyms: ['joint pain', 'arthritis'] },
  { id: '12', code: 'KA02', title: 'Normal pregnancy', synonyms: ['ANC', 'antenatal'] },
  { id: '13', code: 'MA01', title: 'Upper respiratory tract infection', synonyms: ['URTI', 'cold', 'catarrh'] },
  { id: '14', code: '1B12', title: 'Tuberculosis', synonyms: ['TB', 'chronic cough'] },
  { id: '15', code: '1C62', title: 'HIV disease', synonyms: ['human immunodeficiency virus', 'AIDS'] }
];
