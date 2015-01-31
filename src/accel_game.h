#pragma once

#define MATH_PI 3.141592653589793238462
#define NUM_DISCS 4
#define DISC_DENSITY 0.25
#define ACCEL_RATIO 0.01
#define ACCEL_STEP_MS 50

typedef struct Vec2d {
  double x;
  double y;
} Vec2d;

typedef struct Disc {
  Vec2d pos;
  Vec2d vel;
  double mass;
  double radius;
} Disc;

void disk_window_init(Window *window);
Window *disk_window_get_window();
void disk_window_push();
void accel_game_init();