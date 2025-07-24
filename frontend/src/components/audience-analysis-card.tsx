"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AudienceAnalysis } from "@/types";

interface AudienceAnalysisCardProps {
  audienceAnalysis: AudienceAnalysis;
}

export function AudienceAnalysisCard({ audienceAnalysis }: AudienceAnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold">Tone</h4>
          <p className="text-muted-foreground">{audienceAnalysis.tone}</p>
        </div>
        <div>
          <h4 className="font-semibold">Clarity</h4>
          <p className="text-muted-foreground">{audienceAnalysis.clarity}</p>
        </div>
        <div>
          <h4 className="font-semibold">Engagement</h4>
          <p className="text-muted-foreground">{audienceAnalysis.engagement}</p>
        </div>
      </CardContent>
    </Card>
  );
} 