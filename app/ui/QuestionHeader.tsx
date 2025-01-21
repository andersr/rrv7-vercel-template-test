export default function QuestionHeader({
  question,
  questionIndex,
  totalQuestions,
}: {
  question: string | undefined;
  questionIndex: number;
  totalQuestions: number;
}) {
  return (
    <div>
      <h2>{question}</h2>
      <p className="text-sm">
        Question {questionIndex + 1} of {totalQuestions}
      </p>
    </div>
  );
}
