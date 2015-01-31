#include <pebble.h>
#include "question_window.h"

Window *q_window;

Window *q_window_get_window(){
	return q_window;
}

void yes_button_press(ClickRecognizerRef ref, void *ctx){

}

void no_button_press(ClickRecognizerRef ref, void *ctx){
	
}

void q_window_click_config(void *context){
	window_single_click_subscribe(BUTTON_ID_UP, yes_button_press);
	window_single_click_subscribe(BUTTON_ID_DOWN, no_button_press);
}

void q_window_load(Window *window){
	vibes_short_pulse();
}

void q_window_unload(Window *window){
	vibes_long_pulse();
}

void q_window_init(){
	q_window = window_create();
	window_set_background_color(q_window, GColorBlack);
	window_set_window_handlers(q_window, (WindowHandlers){
		.load = q_window_load,
		.unload = q_window_unload,
	});
}