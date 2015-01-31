#include <pebble.h>
#include "question_window.h"
#include "data_framework.h"
#include "accel_game.h"

void init(){
	app_message_register_inbox_received(df_inbox);
	app_message_open(512, 512);

	srand(time(NULL));

	/*
	q_window_init();
	window_stack_push(q_window_get_window(), true);
	*/
	accel_game_init();
	disk_window_push();
}

int main(){
	init();
	app_event_loop();
	return 1337;
}