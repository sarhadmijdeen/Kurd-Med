export enum IdentificationMethod {
  Packaging = 'packaging',
  Name = 'name',
  Chatbot = 'chatbot',
}

export type Language = 'en' | 'ku';

export interface PillInfo {
  name?: string;
  description?: string;
  activeIngredients?: string[];
  dosage?: string;
  uses?: string[];
  sideEffects?: string[];
  disclaimer?: string;
  rawText?: string;
}

export interface ChatMessage {
    sender: 'user' | 'model';
    text: string;
}