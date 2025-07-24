from langchain_core.language_models import BaseLanguageModel
from langchain.prompts import ChatPromptTemplate
from schemas.critique import AudienceAnalysis, AudienceAgentResponse

async def get_audience_analysis(llm: BaseLanguageModel, text: str, audience: str) -> AudienceAgentResponse:
    system_prompt = f"""You are an expert in audience analysis. Your goal is to analyze the following text from the perspective of a specific audience: "{audience}".
You must return a JSON object with a single key "audience_analysis".

The "audience_analysis" key should contain an object with feedback on the text's tone, clarity, and engagement from the perspective of the selected audience.
The audience analysis object must have the following keys: 'tone', 'clarity', and 'engagement'.
'tone', 'clarity', and 'engagement' should be strings providing detailed feedback on that aspect."""

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("user", "{text}")
    ])

    structured_llm = llm.with_structured_output(AudienceAgentResponse)
    chain = prompt | structured_llm
    response = await chain.ainvoke({"text": text})
    return response 