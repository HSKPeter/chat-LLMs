export type PromptOptimizationMode = 'none' | 'without context' | 'with full context';

export type LightMode = 'light' | 'dark';

export interface Settings {
  theme: LightMode;
  promptOptimizationMode: PromptOptimizationMode;
}