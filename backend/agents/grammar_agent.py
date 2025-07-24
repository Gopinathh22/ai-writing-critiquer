from langchain_core.language_models import BaseLanguageModel
from langchain.prompts import ChatPromptTemplate
from schemas.critique import GrammarAgentResponse
from typing import List

async def get_grammar_suggestions(llm: BaseLanguageModel, text: str) -> GrammarAgentResponse:
    system_prompt = """You are a grammar expert. Your goal is to identify and correct grammatical errors in the following text.
You must return a JSON object with a single key "suggestions", which is a list of suggestion objects.
Each suggestion object must have the following keys: 'original_sentence', 'corrected_sentence', 'explanation', and 'type'.
'original_sentence' should be the exact sentence from the source that contains the grammatical error.
'corrected_sentence' should be the corrected version of the sentence.
'explanation' should be a short explanation of the grammatical rule that was broken.
The 'type' should be "grammar"."""

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("user", "{text}")
    ])

    structured_llm = llm.with_structured_output(GrammarAgentResponse)
    chain = prompt | structured_llm
    response = await chain.ainvoke({"text": text})
    return response 