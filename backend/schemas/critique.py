from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class TextToCritique(BaseModel):
    text: str
    model: Literal["google", "anthropic", "openai"]
    customPrompt: Optional[str] = None
    audience: str

class Suggestion(BaseModel):
    original_sentence: str = Field(..., description="The original sentence from the text that has an issue.")
    corrected_sentence: str = Field(..., description="The suggested, corrected version of the sentence.")
    explanation: str = Field(..., description="A brief explanation of why the change is recommended.")
    type: Literal["style", "grammar"] = Field(..., description="The type of suggestion.")

class AnalysisDetail(BaseModel):
    score: int = Field(..., description="A score from 0 to 100 representing the quality of this aspect.")
    feedback: str = Field(..., description="Detailed feedback on this aspect.")

class TitleAnalysis(AnalysisDetail):
    title: str = Field(..., description="The extracted title of the text.")

class Analysis(BaseModel):
    structure: AnalysisDetail
    clarity: AnalysisDetail
    flow: AnalysisDetail
    overallScore: int = Field(..., description="An overall score for the text, from 0 to 100.")
    title: Optional[TitleAnalysis] = Field(None, description="An analysis of the text's title, if it has one.")

class AudienceAnalysis(BaseModel):
    tone: str = Field(..., description="Feedback on the tone of the text from the audience's perspective.")
    clarity: str = Field(..., description="Feedback on the clarity of the text from the audience's perspective.")
    engagement: str = Field(..., description="Feedback on the engagement of the text from the audience's perspective.")

class CritiqueResponse(BaseModel):
    original_text: str = Field(..., description="The original, unedited text sent by the user.")
    suggestions: List[Suggestion]
    analysis: Analysis
    audience_analysis: AudienceAnalysis
    model: str = Field(..., description="The AI model used for the critique.")

class SuggestionAgentResponse(BaseModel):
    suggestions: List[Suggestion]

class GrammarAgentResponse(BaseModel):
    suggestions: List[Suggestion]

class AnalysisAgentResponse(BaseModel):
    analysis: Analysis

class AudienceAgentResponse(BaseModel):
    audience_analysis: AudienceAnalysis 