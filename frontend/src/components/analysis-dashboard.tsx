"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Analysis } from "@/types";
import React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AnalysisDashboardProps {
  analysis: Analysis;
}

const AnalysisItem = ({ title, score, feedback }: { title: string; score: number; feedback: string }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-semibold">{title}</h4>
      <span className="text-sm font-bold">{score}/100</span>
    </div>
    <Progress value={score} className="w-full" />
    <p className="text-sm text-muted-foreground mt-2">{feedback}</p>
  </div>
);

export function AnalysisDashboard({ analysis }: AnalysisDashboardProps) {
  const [showTitle, setShowTitle] = React.useState(true);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Analysis Dashboard</CardTitle>
        {analysis.title && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <DotsHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={showTitle}
                onCheckedChange={setShowTitle}
              >
                Show Title Score
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-center font-semibold mb-2">Overall Score</h4>
          <div className="flex items-center justify-center">
            <div className="text-5xl font-bold">{analysis.overallScore}</div>
            <div className="text-xl text-muted-foreground">/100</div>
          </div>
        </div>
        {analysis.title && showTitle && (
          <>
            <Separator />
            <div>
              <h4 className="text-center font-semibold mb-2">Title Analysis</h4>
              <p className="text-center text-lg italic mb-2">&quot;{analysis.title.title}&quot;</p>
              <AnalysisItem title="Title Score" score={analysis.title.score} feedback={analysis.title.feedback} />
            </div>
          </>
        )}
        <Separator />
        <div className="space-y-4">
          <AnalysisItem title="Structure" score={analysis.structure.score} feedback={analysis.structure.feedback} />
          <AnalysisItem title="Clarity" score={analysis.clarity.score} feedback={analysis.clarity.feedback} />
          <AnalysisItem title="Flow" score={analysis.flow.score} feedback={analysis.flow.feedback} />
        </div>
      </CardContent>
    </Card>
  );
} 