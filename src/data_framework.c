#define _POSIX_C_SOURCE >= 199309L

#include <pebble.h>
#include <inttypes.h>
#include <math.h>
#include <stdio.h>
#include <time.h>
#include "data_framework.h"

bool questions[31];
bool something_exists = false;
bool internet_connected = false;

const char *pebble_qs_text[] = {
	"Is black a colour of the rainbow",
	"Is the sky purple?",
	"Are there 5 fingers in one hand?",
	"Are there 24 hours in a day?",
	"Are there 7 days in a week?",
	"Is blurple a colour?", //I'm a level 6 lazer lotus
	"Is three a number?",
	"Do you eat water?",
	"Do pigs fly?",
	"Is gray a shade?",
	"Does a phone call?",
	"Is water a fluid?",
};

const bool pebble_qs_answers[] = {
	false,
	false,
	true,
	true,
	true,
	false,
	true,
	false,
	false,
	true,
	true
}; 

Answer *qdatapackage_create(){
	Answer *package;
	package = malloc(sizeof(Answer));

	return package;
}

void process_tuple(Tuple *t){
	int key = t->key;
	APP_LOG(APP_LOG_LEVEL_INFO, "Inbox: Got key %d", key);
  switch (key) {
	  case 200:
	  	internet_connected = true;
	  	break;
  }
}

void df_inbox(DictionaryIterator *iter, void *context){
	Tuple *t = dict_read_first(iter);
	if(t){
		process_tuple(t);
	}
	while(t != NULL){
		t = dict_read_next(iter);
		if(t){
			process_tuple(t);
		}
	}
}

void send_answer(Answer *answer){
	DictionaryIterator *dictio;
	app_message_outbox_begin(&dictio);

	if(dictio == NULL){
		return;
	}

	dict_write_uint8(dictio, 50, 52);
	dict_write_cstring(dictio, 0, answer->text[0]);
	dict_write_uint8(dictio, 1, answer->answeredCorrectly);
	dict_write_uint32(dictio, 2, answer->timestamp);
	dict_write_uint8(dictio, 3, answer->difficulty);
	dict_write_end(dictio);

	app_message_outbox_send();
}

void qdatapackage_send(Answer *package){
	Answer toSend;
	memcpy(&toSend, package, sizeof(toSend));
}

void set_amount_of_questions(){
	for(int i = 0; i < 30; i++){
		questions[i] = persist_exists(i+300);
		if(persist_exists(i+300)){
			something_exists = true;
		}
	}
}

void handle_answer(Answer *answer){
	if(internet_connected){
		send_answer(answer);
	}
	else{
		int persistkc = persist_read_int(200);
		persistkc++;

		Answer answert;
		memcpy(&answert, answer, sizeof(answert));
		persist_write_data(persistkc, &answert, sizeof(answert));
		APP_LOG(APP_LOG_LEVEL_INFO, "writing to %d.", persistkc);
		persist_write_int(200, persistkc);
	}
}

Question* get_random_question(){
	Question *question;
	question = malloc(sizeof(Question));
	set_amount_of_questions();
	
	if(something_exists){
		int random = 30;
		while(questions[random] == false){
			random = rand() % 31;
		}

		persist_read_data(random, question, sizeof(question));
	}
	else{
		strcpy(question->text[0], pebble_qs_text[rand() % 11]);
		question->correct = false;
		question->difficulty = false;
	}

	return question;
}