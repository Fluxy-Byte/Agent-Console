export interface FormState {
  name: string;
  isActive: boolean;
  welcomeMessage: string;
  welcomeEnabled: boolean;
  processingMessage: string;
  transferMessage: string;
  unsupportedFormatMessage: string;
  blockedMessage: string;
  outOfHoursMessage: string;
  outOfHoursEnabled: boolean;
  closingMessage: string;
  closingEnabled: boolean;
  errorMessage: string;
  errorEnabled: boolean;
  personality: string;
  ragEnabled: boolean;
  ragChunkSize: number;
}

export interface AgentFormTabProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  disabled: boolean;
}
