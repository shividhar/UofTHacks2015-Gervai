#include <pebble.h>
#include "question_window.h"
#include "data_framework.h"
#include "extras.h"
#include "animated_ab.h"

Window *q_window;
Answer *current_answer;
Question *current_question;
ActionBarLayer *confirm_ab;
TextLayer *title_layer, *question_layer;
GBitmap *x_icon, *check_icon;

Window *q_window_get_window(){
	return q_window;
}

void answer(bool yes){
	strcpy(current_answer->text[0], current_question->text[0]);
	current_answer->answeredCorrectly = (yes == current_question->correct);
	current_answer->difficulty = current_question->difficulty;
	current_answer->timestamp = (long)time(NULL);
	hide_actionbar(confirm_ab);
	animate_layer(text_layer_get_layer(title_layer), &GRect(0, 0, 124, 168), &GRect(0, 44, 144, 168), 1500, 0);
	text_layer_set_text(title_layer, "Thanks for answering!");
	vibes_double_pulse();

	handle_answer(current_answer);
}

void yes_button_press(ClickRecognizerRef ref, void *ctx){
	answer(true);
}

void no_button_press(ClickRecognizerRef ref, void *ctx){
	answer(false);
}

void q_window_click_config(void *context){
	window_single_click_subscribe(BUTTON_ID_UP, yes_button_press);
	window_single_click_subscribe(BUTTON_ID_DOWN, no_button_press);
}

void q_window_load(Window *window){
	Layer *window_layer = window_get_root_layer(window);

	current_answer = malloc(sizeof(Answer));

	x_icon = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_X_ICON);
	check_icon = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_CHECKMARK_ICON);

	current_question = get_random_question();

	confirm_ab = action_bar_layer_create();
	action_bar_layer_set_click_config_provider(confirm_ab, q_window_click_config);
	action_bar_layer_set_background_color(confirm_ab, GColorWhite);
	action_bar_layer_set_icon(confirm_ab, BUTTON_ID_UP, check_icon);
	action_bar_layer_set_icon(confirm_ab, BUTTON_ID_DOWN, x_icon);
	action_bar_layer_add_to_window(confirm_ab, window);

	title_layer = text_layer_init(GRect(0, 0, 124, 168), GTextAlignmentCenter, 0);
	text_layer_set_text(title_layer, current_question->text[0]);
	layer_add_child(window_layer, text_layer_get_layer(title_layer));

	APP_LOG(APP_LOG_LEVEL_INFO, "Question contents: %s", current_question->text[0]);
}

void q_window_unload(Window *window){
	action_bar_layer_destroy(confirm_ab);
	text_layer_destroy(title_layer);
	gbitmap_destroy(x_icon);
	gbitmap_destroy(check_icon);
}

void q_window_init(){
	q_window = window_create();
	window_set_background_color(q_window, GColorBlack);
	window_set_window_handlers(q_window, (WindowHandlers){
		.load = q_window_load,
		.unload = q_window_unload,
	});
}