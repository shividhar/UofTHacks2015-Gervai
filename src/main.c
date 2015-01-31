#include <pebble.h>
#include "question_window.h"
#include "data_framework.h"

void init(){
	app_message_register_inbox_received(df_inbox);
	app_message_open(512, 512);

	q_window_init();
	window_stack_push(q_window_get_window(), true);
}

int main(){
	init();
	app_event_loop();
	return 1337;
}