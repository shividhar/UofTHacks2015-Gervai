#include <pebble.h>
#include "question_window.h"

void init(){
	q_window_init();
	window_stack_push(q_window_get_window(), true);
}

int main(){
	init();
	app_event_loop();
	return 1337;
}