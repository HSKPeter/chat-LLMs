export type PromptOptimizationMode = 'none' | 'without context' | 'with full context';

export interface Settings {
  theme: 'light' | 'dark';
  promptOptimizationMode: PromptOptimizationMode;
}