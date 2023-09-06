import { LargeLanguageModel, LargeLanguageModelID } from "@/types/llm";

export function isGptModel(llm: LargeLanguageModel) {
    return llm.id === LargeLanguageModelID.GPT_3_5 || llm.id === LargeLanguageModelID.GPT_4;
}

export function isGptModelId(llmId: LargeLanguageModelID | undefined) {
    return llmId === LargeLanguageModelID.GPT_3_5 || llmId === LargeLanguageModelID.GPT_4;
}