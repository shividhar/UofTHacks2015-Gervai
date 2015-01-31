#pragma once

Window *q_window_get_window();
void yes_button_press(ClickRecognizerRef ref, void *ctx);
void no_button_press(ClickRecognizerRef ref, void *ctx);
void q_window_click_config(void *context);
void q_window_load(Window *window);
void q_window_unload(Window *window);
void q_window_init();