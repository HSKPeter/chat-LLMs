import { LargeLanguageModelID } from "@/types/llm";

export function isGptModelId(llm: LargeLanguageModelID | undefined) {
    return llm === LargeLanguageModelID.GPT_3_5 || llm === LargeLanguageModelID.GPT_4;
}