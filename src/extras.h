#pragma once
TextLayer *text_layer_init(GRect location, GTextAlignment alignment, int font);
void animate_layer(Layer *layer, GRect *start, GRect *finish, int length, int delay);
Animation *animate_layer_return(Layer *layer, GRect *start, GRect *finish, int length, int delay);