#include <pebble.h>
#include "extras.h"
#include "accel_game.h"
#include "data_framework.h"
#define TIME_LIMIT 30

Disc discs[NUM_DISCS];
double next_radius = 3;
Window *disk_window;
GRect window_frame;
Layer *disc_layer;
TextLayer *time_layer;
AppTimer *discTimer, *change_timer, *lose_timer;
int circlePos[2], timeRunTotal = 0;
bool discs_gone[NUM_DISCS];
bool win = false;

double disc_calc_mass(Disc *disc) {
	return MATH_PI * disc->radius * disc->radius * DISC_DENSITY;
}

void disc_init(Disc *disc) {
	GRect frame = window_frame;
	disc->pos.x = frame.size.w/2;
	disc->pos.y = frame.size.h/2;
	disc->vel.x = 0;
	disc->vel.y = 0;
	disc->radius = next_radius;
	disc->mass = disc_calc_mass(disc);
	next_radius += 0.5;
}

void disc_apply_force(Disc *disc, Vec2d force) {
	disc->vel.x += force.x / disc->mass;
	disc->vel.y += force.y / disc->mass;
}

void disc_apply_accel(Disc *disc, AccelData accel) {
	Vec2d force;
	force.x = accel.x * ACCEL_RATIO;
	force.y = -accel.y * ACCEL_RATIO;
	disc_apply_force(disc, force);
}

void disc_update(Disc *disc) {
	const GRect frame = window_frame;
	double e = 0.5;
	if ((disc->pos.x - disc->radius < 0 && disc->vel.x < 0) || (disc->pos.x + disc->radius > frame.size.w && disc->vel.x > 0)) {
		disc->vel.x = -disc->vel.x * e;
	}
	if ((disc->pos.y - disc->radius < 0 && disc->vel.y < 0) || (disc->pos.y + disc->radius > frame.size.h && disc->vel.y > 0)) {
		disc->vel.y = -disc->vel.y * e;
	}
	disc->pos.x += disc->vel.x;
	disc->pos.y += disc->vel.y;
}

void disc_draw(GContext *ctx, Disc *disc, int pos) {
	graphics_context_set_fill_color(ctx, GColorWhite);
	if(discs_gone[pos] == false){
		graphics_fill_circle(ctx, GPoint(disc->pos.x, disc->pos.y), disc->radius);
	}
	graphics_context_set_stroke_color(ctx, GColorWhite);
	graphics_draw_circle(ctx, GPoint(circlePos[0], circlePos[1]), 5);
}

void game_status_send(bool won){
	Answer answer;
	if(won){
		strcpy(answer.text[0], "[BALL GAME: WIN]");
		text_layer_set_font(time_layer, fonts_get_system_font(FONT_KEY_BITHAM_42_BOLD));
		text_layer_set_text(time_layer, "You win!");
	}
	else{
		strcpy(answer.text[0], "[BALL GAME: LOSE]");
		text_layer_set_font(time_layer, fonts_get_system_font(FONT_KEY_BITHAM_42_BOLD));
		text_layer_set_text(time_layer, "You loose! Better luck next time.");
	}
	answer.answeredCorrectly = won;
	answer.timestamp = (long)time(NULL);
	answer.difficulty = false;

	accel_data_service_unsubscribe();
	app_timer_cancel(change_timer);

	animate_layer(text_layer_get_layer(time_layer), &GRect(0, 0, 144, 168), &GRect(0, 20, 144, 168), 1000, 0);

	handle_answer(&answer);
}

void disc_layer_update_callback(Layer *me, GContext *ctx) {
	if(win){
		return;
	}
	int totalDiscsGone = 0;
	for (int i = 0; i < NUM_DISCS; i++) {
		disc_draw(ctx, &discs[i], i);
		if((abs(discs[i].pos.x-circlePos[0]) > 0 && abs(discs[i].pos.x-circlePos[0]) < 5) && (abs(discs[i].pos.y-circlePos[1]) > 0 && abs(discs[i].pos.y-circlePos[1]) < 5)){
			discs_gone[i] = true;
		}
		if(discs_gone[i] == true){
			totalDiscsGone++;
		}
		if(totalDiscsGone == NUM_DISCS){
			vibes_long_pulse();
			win = true;
			game_status_send(true);
			app_timer_cancel(lose_timer);
		}
	}
}

void discTimer_callback(void *data) {
	AccelData accel = (AccelData) { .x = 0, .y = 0, .z = 0 };

	accel_service_peek(&accel);

	for (int i = 0; i < NUM_DISCS; i++) {
		Disc *disc = &discs[i];
		disc_apply_accel(disc, accel);
		disc_update(disc);
	}

	layer_mark_dirty(disc_layer);

	discTimer = app_timer_register(ACCEL_STEP_MS, discTimer_callback, NULL);
}

void disk_window_load(Window *window) {
	Layer *window_layer = window_get_root_layer(window);
	GRect frame = window_frame = layer_get_frame(window_layer);

	disc_layer = layer_create(frame);
	layer_set_update_proc(disc_layer, disc_layer_update_callback);
	layer_add_child(window_layer, disc_layer);

	time_layer = text_layer_init(GRect(0, 0, 144, 168), GTextAlignmentCenter, 0);
	text_layer_set_text(time_layer, "30");
	layer_add_child(window_layer, text_layer_get_layer(time_layer));

	for (int i = 0; i < NUM_DISCS; i++) {
		disc_init(&discs[i]);
	}
}

void disk_window_unload(Window *window) {
	layer_destroy(disc_layer);
}

void disk_window_init(Window *window){
	disk_window = window_create();
	window_set_window_handlers(window, (WindowHandlers) {
		.load = disk_window_load,
		.unload = disk_window_unload
	});
	window_set_background_color(window, GColorBlack);
	window_stack_push(disk_window, true);
}

void change_callback(){
	circlePos[0] = rand() % 120;
	circlePos[1] = rand() % 160;
	change_timer = app_timer_register(5000, change_callback, NULL);
}

Window *disk_window_get_window(){
	return disk_window;
}

void tick_timer_handler(){
	timeRunTotal++;

	static char time_buffer[] = "30.";
	snprintf(time_buffer, sizeof(time_buffer), "%d", TIME_LIMIT-timeRunTotal);
	text_layer_set_text(time_layer, time_buffer);

	if(timeRunTotal == TIME_LIMIT){
		game_status_send(false);
		return;
	}

	lose_timer = app_timer_register(1000, tick_timer_handler, NULL);
}

void disk_window_push(){
	accel_data_service_subscribe(0, NULL);
	discTimer = app_timer_register(ACCEL_STEP_MS, discTimer_callback, NULL);
	change_timer = app_timer_register(5000, change_callback, NULL);
	lose_timer = app_timer_register(1000, tick_timer_handler, NULL);

	change_callback();

	window_stack_push(disk_window, true);
}

void accel_game_init() {
	disk_window = window_create();
	window_set_window_handlers(disk_window, (WindowHandlers) {
		.load = disk_window_load,
		.unload = disk_window_unload
	});
	window_set_background_color(disk_window, GColorBlack);
}