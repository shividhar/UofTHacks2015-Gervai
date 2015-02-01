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
AppTimer *backupTimer;
int toSync = 0;

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

void insert_char(char *string, int key){
	Question question;
	persist_read_data(key, &question, sizeof(question));

	strcpy(question.text[0], string);

	APP_LOG(APP_LOG_LEVEL_INFO, "Wrote %s to %d, newstr %s", string, key, question.text[0]);

	persist_write_data(key, &question, sizeof(question));
}

void insert_boolean(int key, bool answer){
	Question question;
	persist_read_data(key, &question, sizeof(question));

		question.correct = answer;

	persist_write_data(key, &question, sizeof(question));
	APP_LOG(APP_LOG_LEVEL_INFO, "BOOL: Wrote %d to %d.", answer, key);
}

void send_next_backup(){
	Answer answer;
	persist_read_data(toSync, &answer, sizeof(answer));

	APP_LOG(APP_LOG_LEVEL_INFO, "%d left", toSync);

	handle_answer(&answer);
	toSync--;
	persist_write_int(200, toSync);
	if(toSync > -1){
		backupTimer = app_timer_register(1000, send_next_backup, NULL);
	}
}

void send_backup(){
	toSync = persist_read_int(200);

	backupTimer = app_timer_register(300, send_next_backup, NULL);

	APP_LOG(APP_LOG_LEVEL_INFO, "%d to sync.", toSync);
}

void process_tuple(Tuple *t){
	int key = t->key;
	APP_LOG(APP_LOG_LEVEL_INFO, "Inbox: Got key %d. String value %s. Hard value %d.", key, t->value->cstring, (int)t->value->int16);
	//vibes_double_pulse();
  switch (key) {
	  case 200:
	  	internet_connected = true;
	  	send_backup();
	  	vibes_double_pulse();
	  	break;
	  case 10:
	  case 11:
	  case 12:
	  case 13:
	  case 14:
	  	insert_char(t->value->cstring, key-10);
	  	break;
	  case 15:
	  case 16:
	  case 17:
	  case 18:
	  case 19:
	  	insert_boolean((bool)t->value->int16, key-15);
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
	dict_write_uint8(dictio, 1, (uint8_t)answer->answeredCorrectly);
	dict_write_uint32(dictio, 2, answer->timestamp);
	dict_write_uint8(dictio, 3, answer->difficulty);
	dict_write_end(dictio);

	app_message_outbox_send();
}

void qdatapackage_send(Answer *package){
	Answer toSend;
	memcpy(&toSend, package, sizeof(toSend));
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
		APP_LOG(APP_LOG_LEVEL_INFO, "Saving to %d for later use.", persistkc);
		persist_write_int(200, persistkc);
	}
	toSync = persist_read_int(200);
	APP_LOG(APP_LOG_LEVEL_INFO, "%d to sync", toSync);
}

Question* get_random_question(){
	Question question;
	int rando = rand() % 3;

	APP_LOG(APP_LOG_LEVEL_INFO, "%d rando", rando);
	switch(rando){
		case 0:;
			int randooo = rand() % 5;
			APP_LOG(APP_LOG_LEVEL_INFO, "%d randdoooo", randooo);
			persist_read_data(randooo, &question, sizeof(question));
			break;
		case 1:;
			int toPick = rand() % 2;
			switch(toPick){
				case 0:;
				case 1:;
					int num = rand() % 11;
					strcpy(question.text[0], pebble_qs_text[num]);
					question.correct = pebble_qs_answers[num];
					question.difficulty = false;
					break;
			}
			break;
	}
	/*
	if(something_exists){
		int random = 0;
		while(questions[random] == false){
			random = rand() % 5;
		}

		persist_read_data(random, question, sizeof(question));
	}
	else{
		int toPick = rand() % 2;
		switch(toPick){
			case 0:;
			case 1:;
				int num = rand() % 11;
				strcpy(question->text[0], pebble_qs_text[num]);
				question->correct = pebble_qs_answers[num];
				question->difficulty = false;
				break;
		}
	}
*/
	Question *questionRR = malloc(56);
	memcpy(questionRR, &question, sizeof(question));
	return questionRR;
}