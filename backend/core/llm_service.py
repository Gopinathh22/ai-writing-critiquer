import asyncio
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from schemas.critique import CritiqueResponse, TextToCritique
from agents.suggestion_agent import get_suggestions
from agents.analysis_agent import get_analysis
from agents.grammar_agent import get_grammar_suggestions
from agents.audience_agent import get_audience_analysis

# Initialize LLMs
try:
    google_llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro", temperature=0.7)
    anthropic_llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0.7, max_tokens=2024)
    openai_llm = ChatOpenAI(model="gpt-4.1", temperature=0.7)
except Exception as e:
    print(f"Warning: Could not initialize all LLMs. {e}")
    google_llm = None
    anthropic_llm = None
    openai_llm = None

# Create a dictionary to map model names to LLM clients
llm_map = {
    "google": google_llm,
    "anthropic": anthropic_llm,
    "openai": openai_llm,
}

async def get_critique_from_llm(text_to_critique: TextToCritique) -> CritiqueResponse:
    selected_llm = llm_map.get(text_to_critique.model)
    if not selected_llm:
        raise ValueError("Invalid model selected.")

    suggestion_task = get_suggestions(selected_llm, text_to_critique.text, text_to_critique.customPrompt)
    analysis_task = get_analysis(selected_llm, text_to_critique.text, text_to_critique.customPrompt)
    grammar_task = get_grammar_suggestions(selected_llm, text_to_critique.text)
    audience_task = get_audience_analysis(selected_llm, text_to_critique.text, text_to_critique.audience)

    results = await asyncio.gather(
        suggestion_task,
        analysis_task,
        grammar_task,
        audience_task
    )

    style_suggestions = results[0].suggestions
    analysis = results[1].analysis
    grammar_suggestions = results[2].suggestions
    audience_analysis = results[3].audience_analysis
    
    all_suggestions = style_suggestions + grammar_suggestions

    return CritiqueResponse(
        original_text=text_to_critique.text,
        suggestions=all_suggestions,
        analysis=analysis,
        audience_analysis=audience_analysis,
        model=text_to_critique.model
    ) 