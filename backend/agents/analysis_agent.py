from langchain_core.language_models import BaseLanguageModel
from langchain.prompts import ChatPromptTemplate
from schemas.critique import Analysis
from pydantic import BaseModel

class AnalysisAgentResponse(BaseModel):
    analysis: Analysis

async def get_analysis(llm: BaseLanguageModel, text: str, custom_prompt: str) -> AnalysisAgentResponse:
    base_system_prompt = """You are a world-class writing critic. Your goal is to provide a high-level analysis of the following text.
You must return a JSON object with a single key "analysis".

The "analysis" key should contain an object with feedback on the text's structure, clarity, and flow, as well as an overall score.
The analysis object must have the following keys: 'structure', 'clarity', 'flow', and 'overallScore'.
'structure', 'clarity', and 'flow' should be objects with two keys: 'score' and 'feedback'.
'score' should be an integer from 0 to 100.
'feedback' should be a string providing detailed feedback on that aspect.
'overallScore' should be an integer from 0 to 100 representing the overall quality of the text.

The "analysis" object can also optionally contain a "title" key. If a title is present in the text, the "title" key should contain an object with three keys: 'title', 'score', and 'feedback'.
'title' should be the extracted title of the text.
'score' should be an integer from 0 to 100, rating the title's effectiveness and uniqueness.
'feedback' should be a string explaining the score.
If no title is present, the "title" key should be omitted from the JSON output."""

    if custom_prompt:
        system_prompt = f"{base_system_prompt}\\n\\nAdditionally, please adhere to the following instructions:\\n{custom_prompt}"
    else:
        system_prompt = base_system_prompt

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("user", "{text}")
    ])

    structured_llm = llm.with_structured_output(AnalysisAgentResponse)
    chain = prompt | structured_llm
    response = await chain.ainvoke({"text": text})
    return response 