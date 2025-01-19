export interface TriviaGame {
	questions: TriviaQuestion[];
}

export interface TriviaQuestion {
	question: string;
	category: string;
	choices: string[];
	correctAnswer: string;
}
