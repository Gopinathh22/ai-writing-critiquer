from langchain_core.language_models import BaseLanguageModel
from langchain.prompts import ChatPromptTemplate
from schemas.critique import SuggestionAgentResponse
from typing import List

async def get_suggestions(llm: BaseLanguageModel, text: str, custom_prompt: str) -> SuggestionAgentResponse:
    base_system_prompt = """You are a world-class writing critic. Your goal is to provide constructive, sentence-by-sentence feedback on the following text.
You must identify sentences that could be improved and provide a corrected version, along with a brief explanation.
The response should be a JSON object with a single key "suggestions", which is a list of suggestion objects.
Each suggestion object must have the following keys: 'original_sentence', 'corrected_sentence', 'explanation', and 'type'.
'original_sentence' should be the exact sentence from the source that you are critiquing.
'corrected_sentence' should be the improved version of the sentence.
'explanation' should be a short reason for the change.
The 'type' should be "style"."""

    if custom_prompt:
        system_prompt = f"{base_system_prompt}\\n\\nAdditionally, please adhere to the following instructions:\\n{custom_prompt}"
    else:
        system_prompt = base_system_prompt

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("user", "{text}")
    ])

    structured_llm = llm.with_structured_output(SuggestionAgentResponse)
    chain = prompt | structured_llm
    response = await chain.ainvoke({"text": text})
    return response 