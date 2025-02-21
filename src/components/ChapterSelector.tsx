
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chapter } from "@/types/practice";

interface ChapterSelectorProps {
  chapters: Chapter[];
  selectedChapter: string | null;
  onChapterSelect: (chapterId: string) => void;
}

const ChapterSelector = ({
  chapters,
  selectedChapter,
  onChapterSelect
}: ChapterSelectorProps) => {
  return (
    <Card className="glass-card p-6 animate-fade-up mb-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Select a Chapter</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {chapters.map(chapter => (
          <Button
            key={chapter.id}
            variant={selectedChapter === chapter.id ? "default" : "secondary"}
            className="justify-start hover:scale-105 transition-transform duration-200"
            onClick={() => onChapterSelect(chapter.id)}
          >
            {chapter.name}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default ChapterSelector;
