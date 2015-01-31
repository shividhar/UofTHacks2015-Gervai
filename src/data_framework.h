#pragma once

typedef struct Answer{
	bool difficulty;
	bool answeredCorrectly;
	char text[1][50];
	long timestamp;
}Answer;

typedef struct Question {
	bool difficulty;
	bool correct;
	char text[1][50];
}Question;

Answer *qdatapackage_create();
void qdatapackage_send(Answer *package);
int get_amount_of_questions();
Question* get_random_question();
void df_inbox(DictionaryIterator *iter, void *context);
void handle_answer(Answer *answer);