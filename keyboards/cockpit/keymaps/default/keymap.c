#include QMK_KEYBOARD_H

// Add these definitions at the top with other defines
#define GAMING_RED    128
#define GAMING_GREEN  0
#define GAMING_BLUE   0

#define MAC_RED       0
#define MAC_GREEN     0
#define MAC_BLUE      128

#define WIN_RED       0
#define WIN_GREEN     128
#define WIN_BLUE      0

// OS Detection configuration
#define OS_DETECTION_DEBOUNCE 250  // 250ms debounce time
#define OS_DETECTION_SINGLE_REPORT  // Only report once when stable

// Layer order is important - base layers must come first
enum cockpit_layer {
    _MAC_MODE = 0,  // Base layer for Mac
    _WIN_MODE,      // Base layer for Windows
    _GAME_MODE,     // Gaming mode with QWERTY layout
    _MEDIA,         // Function layers after base layers
    _NAV,
    _SYM,
    _NUM,
    _ADJUST
};

// OS detection and manual override state
bool is_mac_mode = false;  // Default to Windows mode
bool manual_os_override = false;  // Track if user manually set the OS

// Keyboard initialization
void keyboard_post_init_user(void) {
    // Start in Windows mode by default
    is_mac_mode = false;
    manual_os_override = false;
    layer_clear();
    layer_on(_WIN_MODE);  // Enable Windows base layer
    rgblight_enable();
    rgblight_sethsv(WIN_RED, WIN_GREEN, WIN_BLUE);
}

// OS Detection callback
bool process_detected_host_os_kb(os_variant_t detected_os) {
    if (!process_detected_host_os_user(detected_os)) {
        return false;
    }
    
    // Only switch if no manual override
    if (!manual_os_override) {
        switch (detected_os) {
            case OS_MACOS:
            case OS_IOS:
                if (!is_mac_mode) {
                    is_mac_mode = true;
                    layer_move(_MAC_MODE);  // Switch to Mac base layer
                    rgblight_sethsv(MAC_RED, MAC_GREEN, MAC_BLUE);
                }
                break;
            case OS_WINDOWS:
            case OS_LINUX:
                if (is_mac_mode) {
                    is_mac_mode = false;
                    layer_move(_WIN_MODE);  // Switch to Windows base layer
                    rgblight_sethsv(WIN_RED, WIN_GREEN, WIN_BLUE);
                }
                break;
            case OS_UNSURE:
                // Keep current state if unsure, but ensure we're in a valid layer
                if (!layer_state) {
                    layer_on(_WIN_MODE);  // Default to Windows mode if no layer is active
                }
                break;
        }
    }
    return true;
}

// Layer keys
#define ESC_MEDIA   LT(_MEDIA, KC_ESC)
#define SPC_NAV     LT(_NAV, KC_SPC)
#define ENT_SYM     LT(_SYM, KC_ENT)
#define BSPC_NUM    LT(_NUM, KC_BSPC)
#define ADJUST      MO(_ADJUST)

// Left-hand home row mods for Mac (CAGS)
#define MAC_CTL_A   LCTL_T(KC_A)
#define MAC_ALT_R   LALT_T(KC_R)
#define MAC_GUI_S   LGUI_T(KC_S)
#define MAC_SFT_T   LSFT_T(KC_T)

// Right-hand home row mods for Mac (CAGS)
#define MAC_SFT_N   RSFT_T(KC_N)
#define MAC_GUI_E   RGUI_T(KC_E)
#define MAC_ALT_I   LALT_T(KC_I)
#define MAC_CTL_O   RCTL_T(KC_O)

// Left-hand home row mods for Windows (GACS)
#define WIN_GUI_A   LGUI_T(KC_A)
#define WIN_ALT_R   LALT_T(KC_R)
#define WIN_CTL_S   LCTL_T(KC_S)
#define WIN_SFT_T   LSFT_T(KC_T)

// Right-hand home row mods for Windows (GACS)
#define WIN_SFT_N   RSFT_T(KC_N)
#define WIN_CTL_E   RCTL_T(KC_E)
#define WIN_ALT_I   LALT_T(KC_I)
#define WIN_GUI_O   RGUI_T(KC_O)

// Clipboard keys for both OS
#define MAC_COPY LGUI(KC_C)
#define MAC_PASTE LGUI(KC_V)
#define MAC_CUT LGUI(KC_X)
#define WIN_COPY LCTL(KC_C)
#define WIN_PASTE LCTL(KC_V)
#define WIN_CUT LCTL(KC_X)

// OS switch keycodes
enum custom_keycodes {
    MAC_MODE = SAFE_RANGE,
    WIN_MODE,
    GAME_MODE,
    KC_MY_COPY,
    KC_MY_PASTE,
    KC_MY_CUT
};

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {

// Mac Mode Layout
// ╭──────┬──────┬──────┬──────┬──────┬──────╮                   ╭──────┬──────┬──────┬──────┬──────┬──────╮
// │ADJUST│  Q   │  W   │  F   │  P   │  B   │                   │  J   │  L   │  U   │  Y   │  '   │      │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │      │CTL/A │ALT/R │GUI/S │SFT/T │  G   │                   │  M   │SFT/N │GUI/E │ALT/I │CTL/O │      │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │      │  Z   │  X   │  C   │  D   │  V   │                   │  K   │  H   │  ,   │  .   │  /   │      │
// ╰──────┴──────┴──────┴──────┴──────┴──────┼─────────┬─────────┼──────┴──────┴──────┴──────┴──────┴──────╯
//                                           │  MPLY   │  MUTE   │
//                     ╭──────┬──────┬───────┼─────────┴─────────┼──────┬──────┬──────╮
//                     │ESC/MD│SPC/NV│ TAB   │                   │ENT/SY│BSP/NM│ DEL  │
//                     ╰──────┴──────┴───────┴─────┬──────┬──────┴──────┴──────┴──────╯
//                                                 │  UP  │
//                                          ╭──────┼──────┼──────╮
//                                          │ LEFT │ DOWN │ RIGHT│
//                                          ╰──────┴──────┴──────╯

  [_MAC_MODE] = LAYOUT_cockpit(
    ADJUST,   KC_Q,      KC_W,      KC_F,      KC_P,      KC_B,          KC_J,    KC_L,      KC_U,      KC_Y,      KC_QUOT,  XXXXXXX,
    XXXXXXX,  MAC_CTL_A, MAC_ALT_R, MAC_GUI_S, MAC_SFT_T, KC_G,          KC_M,    MAC_SFT_N, MAC_GUI_E, MAC_ALT_I, MAC_CTL_O, XXXXXXX,
    XXXXXXX,  KC_Z,      KC_X,      KC_C,      KC_D,      KC_V,          KC_K,    KC_H,      KC_COMM,   KC_DOT,    KC_SLSH,  XXXXXXX,
                                                          KC_MPLY, KC_MUTE,
                               ESC_MEDIA, SPC_NAV,  KC_TAB,                        ENT_SYM,  BSPC_NUM,  KC_DEL,    
                                                                    KC_UP,
                                                          KC_LEFT,  KC_DOWN,  KC_RGHT
  ),

// Windows Mode Layout
// ╭──────┬──────┬──────┬──────┬──────┬──────╮                   ╭──────┬──────┬──────┬──────┬──────┬──────╮
// │ADJUST│  Q   │  W   │  F   │  P   │  B   │                   │  J   │  L   │  U   │  Y   │  '   │ HOME │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │      │GUI/A │ALT/R │CTL/S │SFT/T │  G   │                   │  M   │SFT/N │CTL/E │ALT/I │GUI/O │ END  │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │ WIN  │  Z   │  X   │  C   │  D   │  V   │                   │  K   │  H   │  ,   │  .   │  /   │      │
// ╰──────┴──────┴──────┴──────┴──────┴──────┼─────────┬─────────┼──────┴──────┴──────┴──────┴──────┴──────╯
//                                           │  MPLY   │  MUTE   │
//                     ╭──────┬──────┬───────┼─────────┴─────────┼──────┬──────┬──────╮
//                     │ESC/MD│SPC/NV│ TAB   │                   │ENT/SY│BSP/NM│ DEL  │
//                     ╰──────┴──────┴───────┴─────┬──────┬──────┴──────┴──────┴──────╯
//                                                 │  UP  │
//                                          ╭──────┼──────┼──────╮
//                                          │ LEFT │ DOWN │ RIGHT│
//                                          ╰──────┴──────┴──────╯

  [_WIN_MODE] = LAYOUT_cockpit(
    ADJUST,   KC_Q,      KC_W,      KC_F,      KC_P,      KC_B,          KC_J,    KC_L,      KC_U,      KC_Y,      KC_QUOT,  KC_HOME,
    XXXXXXX,  WIN_GUI_A, WIN_ALT_R, WIN_CTL_S, WIN_SFT_T, KC_G,          KC_M,    WIN_SFT_N, WIN_CTL_E, WIN_ALT_I, WIN_GUI_O, KC_END,
    KC_LGUI,  KC_Z,      KC_X,      KC_C,      KC_D,      KC_V,          KC_K,    KC_H,      KC_COMM,   KC_DOT,    KC_SLSH,  XXXXXXX,
                                                          KC_MPLY, KC_MUTE,
                               ESC_MEDIA, SPC_NAV,  KC_TAB,                        ENT_SYM,  BSPC_NUM,  KC_DEL,    
                                                                    KC_UP,
                                                          KC_LEFT,  KC_DOWN,  KC_RGHT
  ),

// Gaming Mode Layout (QWERTY)
// ╭──────┬──────┬──────┬──────┬──────┬──────╮                   ╭──────┬──────┬──────┬──────┬──────┬──────╮
// │ ESC  │  Q   │  W   │  E   │  R   │  T   │                   │  Y   │  U   │  I   │  O   │  P   │ BSPC │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │ TAB  │  A   │  S   │  D   │  F   │  G   │                   │  H   │  J   │  K   │  L   │  ;   │ENTER │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │SHIFT │  Z   │  X   │  C   │  V   │  B   │                   │  N   │  M   │  ,   │  .   │  /   │SHIFT │
// ╰──────┴──────┴──────┴──────┴──────┴──────┼─────────┬─────────┼──────┴──────┴──────┴──────┴──────┴──────╯
//                                           │  MPLY   │  MUTE   │
//                     ╭──────┬──────┬───────┼─────────┴─────────┼──────┬──────┬──────╮
//                     │CTRL  │SPACE │ ALT   │                   │ADJUST │ WIN  │ DEL  │
//                     ╰──────┴──────┴───────┴─────┬──────┬──────┴──────┴──────┴──────╯
//                                                 │  UP  │
//                                          ╭──────┼──────┼──────╮
//                                          │ LEFT │ DOWN │ RIGHT│
//                                          ╰──────┴──────┴──────╯

  [_GAME_MODE] = LAYOUT_cockpit(
    KC_ESC,   KC_Q,     KC_W,     KC_E,     KC_R,     KC_T,          KC_Y,    KC_U,     KC_I,     KC_O,     KC_P,     KC_BSPC,
    KC_TAB,   KC_A,     KC_S,     KC_D,     KC_F,     KC_G,          KC_H,    KC_J,     KC_K,     KC_L,     KC_SCLN,  KC_ENT,
    KC_LSFT,  KC_Z,     KC_X,     KC_C,     KC_V,     KC_B,          KC_N,    KC_M,     KC_COMM,  KC_DOT,   KC_SLSH,  KC_RSFT,
                                                    KC_MPLY, KC_MUTE,
                               KC_LCTL,  KC_SPC,   KC_LALT,                     ADJUST,   KC_LGUI,  KC_DEL,    
                                                                    KC_UP,
                                                          KC_LEFT,  KC_DOWN,  KC_RGHT
  ),

// Media Layer
// ╭──────┬──────┬──────┬──────┬──────┬──────╮                   ╭──────┬──────┬──────┬──────┬──────┬──────╮
// │      │      │      │      │      │      │                   │      │      │      │      │      │      │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │      │      │      │      │      │      │                   │      │      │      │      │      │      │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │      │      │      │      │      │      │                   │      │      │      │      │      │      │
// ╰──────┴──────┴──────┴──────┴──────┴──────┼─────────┬─────────┼──────┴──────┴──────┴──────┴──────┴──────╯
//                                           │         │         │
//                     ╭──────┬──────┬───────┼─────────┴─────────┼──────┬──────┬──────╮
//                     │      │      │       │                   │      │      │      │
//                     ╰──────┴──────┴───────┴─────┬──────┬──────┴──────┴──────┴──────╯
//                                                 │      │
//                                          ╭──────┼──────┼──────╮
//                                          │      │      │      │
//                                          ╰──────┴──────┴──────╯

  [_MEDIA] = LAYOUT_cockpit(
    XXXXXXX,  _______,  _______,  _______,  _______,  _______,       _______,  _______,  _______,  _______,  _______,  XXXXXXX,
    XXXXXXX,  _______,  _______,  _______,  _______,  _______,       _______,  _______,  _______,  _______,  _______,  XXXXXXX,
    XXXXXXX,  _______,  _______,  _______,  _______,  _______,       _______,  _______,  _______,  _______,  _______,  XXXXXXX,
                                                    _______,  _______,
                               _______,  _______,  _______,                     _______,  _______,  _______,    
                                                                    _______,
                                                          _______,  _______,  _______
  ),

// Navigation Layer
// ╭──────┬──────┬──────┬──────┬──────┬──────╮                   ╭──────┬──────┬──────┬──────┬──────┬──────╮
// │      │      │      │      │      │      │                   │AGAIN │PASTE │COPY  │CUT   │UNDO  │      │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │      │CTRL  │ALT   │GUI   │SHIFT │      │                   │CAPS  │LEFT  │DOWN  │UP    │RIGHT │      │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │      │      │      │      │      │      │                   │CAPSWD│HOME  │PGDN  │PGUP  │END   │      │
// ╰──────┴──────┴──────┴──────┴──────┴──────┼─────────┬─────────┼──────┴──────┴──────┴──────┴──────┴──────╯
//                                           │         │         │
//                     ╭──────┬──────┬───────┼─────────┴─────────┼──────┬──────┬──────╮
//                     │      │      │       │                   │ENTER │BKSPC │DEL   │
//                     ╰──────┴──────┴───────┴─────┬──────┬──────┴──────┴──────┴──────╯
//                                                 │      │
//                                          ╭──────┼──────┼──────╮
//                                          │      │      │      │
//                                          ╰──────┴──────┴──────╯

  [_NAV] = LAYOUT_cockpit(
    XXXXXXX,  _______,  _______,  _______,  _______,  _______,       KC_AGAIN, KC_MY_PASTE, KC_MY_COPY, KC_MY_CUT, KC_UNDO,  XXXXXXX,
    XXXXXXX,  KC_LCTL,  KC_LALT,  KC_LGUI,  KC_LSFT,  _______,       KC_CAPS,  KC_LEFT,    KC_DOWN,    KC_UP,     KC_RGHT,  XXXXXXX,
    XXXXXXX,  _______,  _______,  _______,  _______,  _______,       QK_CAPS_WORD_TOGGLE,  KC_HOME,    KC_PGDN,    KC_PGUP,   KC_END,   XXXXXXX,
                                                    _______,  _______,
                               _______,  _______,  _______,                     KC_ENT,   KC_BSPC,   KC_DEL,    
                                                                    _______,
                                                          _______,  _______,  _______
  ),

// Symbol Layer
// ╭──────┬──────┬──────┬──────┬──────┬──────╮                   ╭──────┬──────┬──────┬──────┬──────┬──────╮
// │      │  {   │  &   │  *   │  )   │  }   │                   │      │      │      │      │      │      │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │      │  :   │  $   │  %   │  ^   │  +   │                   │      │SHIFT │ GUI  │ ALT  │CTRL  │      │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │      │  ~   │  !   │  @   │  #   │  |   │                   │      │      │      │      │      │      │
// ╰──────┴──────┴──────┴──────┴──────┴──────┼─────────┬─────────┼──────┴──────┴──────┴──────┴──────┴──────╯
//                                           │         │         │
//                     ╭──────┬──────┬───────┼─────────┴─────────┼──────┬──────┬──────╮
//                     │  (   │  )   │   _   │                   │      │      │      │
//                     ╰──────┴──────┴───────┴─────┬──────┬──────┴──────┴──────┴──────╯
//                                                 │      │
//                                          ╭──────┼──────┼──────╮
//                                          │      │      │      │
//                                          ╰──────┴──────┴──────╯

  [_SYM] = LAYOUT_cockpit(
    XXXXXXX,  KC_LCBR,  KC_AMPR,  KC_ASTR,  KC_RPRN,  KC_RCBR,       _______,  _______,  _______,  _______,  _______,  XXXXXXX,
    XXXXXXX,  KC_COLN,  KC_DLR,   KC_PERC,  KC_CIRC,  KC_PLUS,       _______,  KC_RSFT,  KC_RGUI,  KC_RALT,  KC_RCTL,  XXXXXXX,
    XXXXXXX,  KC_TILD,  KC_EXLM,  KC_AT,    KC_HASH,  KC_PIPE,       _______,  _______,  _______,  _______,  _______,  XXXXXXX,
                                                    _______,  _______,
                               KC_LPRN,  KC_RPRN,  KC_UNDS,                     _______,  _______,  _______,    
                                                                    _______,
                                                          _______,  _______,  _______
  ),

// Number Layer
// ╭──────┬──────┬──────┬──────┬──────┬──────╮                   ╭──────┬──────┬──────┬──────┬──────┬──────╮
// │      │  [   │  7   │  8   │  9   │  ]   │                   │      │      │      │      │      │      │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │      │  ;   │  4   │  5   │  6   │  =   │                   │      │SHIFT │ GUI  │ ALT  │CTRL  │      │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │      │  `   │  1   │  2   │  3   │  \   │                   │      │      │      │      │      │      │
// ╰──────┴──────┴──────┴──────┴──────┴──────┼─────────┬─────────┼──────┴──────┴──────┴──────┴──────┴──────╯
//                                           │         │         │
//                     ╭──────┬──────┬───────┼─────────┴─────────┼──────┬──────┬──────╮
//                     │  .   │  0   │   -   │                   │      │      │      │
//                     ╰──────┴──────┴───────┴─────┬──────┬──────┴──────┴──────┴──────╯
//                                                 │      │
//                                          ╭──────┼──────┼──────╮
//                                          │      │      │      │
//                                          ╰──────┴──────┴──────╯

  [_NUM] = LAYOUT_cockpit(
    XXXXXXX,  KC_LBRC,  KC_7,     KC_8,     KC_9,     KC_RBRC,       _______,  _______,  _______,  _______,  _______,  XXXXXXX,
    XXXXXXX,  KC_SCLN,  KC_4,     KC_5,     KC_6,     KC_EQL,        _______,  KC_RSFT,  KC_RGUI,  KC_RALT,  KC_RCTL,  XXXXXXX,
    XXXXXXX,  KC_GRV,   KC_1,     KC_2,     KC_3,     KC_BSLS,       _______,  _______,  _______,  _______,  _______,  XXXXXXX,
                                                    _______,  _______,
                               KC_DOT,   KC_0,     KC_MINS,                     _______,  _______,  _______,    
                                                                    _______,
                                                          _______,  _______,  _______
  ),

// Adjust Layer
// ╭──────┬──────┬──────┬──────┬──────┬──────╮                   ╭──────┬──────┬──────┬──────┬──────┬──────╮
// │      │MAC_MD│WIN_MD│GAME  │      │      │                   │RGB_TG│      │      │      │      │RESET │
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │SLEEP │      │      │      │      │      │                   │      │      │      │      │      │REBOOT│
// ├──────┼──────┼──────┼──────┼──────┼──────┤                   ├──────┼──────┼──────┼──────┼──────┼──────┤
// │      │      │      │      │      │      │                   │      │      │      │      │      │      │
// ╰──────┴──────┴──────┴──────┴──────┴──────┼─────────┬─────────┼──────┴──────┴──────┴──────┴──────┴──────╯
//                                           │         │         │
//                     ╭──────┬──────┬───────┼─────────┴─────────┼──────┬──────┬──────╮
//                     │      │      │       │                   │      │      │      │
//                     ╰──────┴──────┴───────┴─────┬──────┬──────┴──────┴──────┴──────╯
//                                                 │      │
//                                          ╭──────┼──────┼──────╮
//                                          │      │      │      │
//                                          ╰──────┴──────┴──────╯

  [_ADJUST] = LAYOUT_cockpit(
    _______,  MAC_MODE,  WIN_MODE,  GAME_MODE, _______,  _______,       RGB_TOG,  _______,  _______,  _______,  _______,  QK_BOOT,
    KC_SLEP,  _______,   _______,   _______,   _______,  _______,       _______,  _______,  _______,  _______,  _______,  QK_RBT,
    XXXXXXX,  _______,   _______,   _______,   _______,  _______,       _______,  _______,  _______,  _______,  _______,  XXXXXXX,
                                                    _______,  _______,
                               _______,  _______,  _______,                     _______,  _______,  _______,    
                                                                    _______,
                                                          _______,  _______,  _______
  ),
};

static uint16_t app_switcher_timer = 0;
static bool app_switcher_active = false;


/*
 * Handles encoder rotation events for both left and right encoders
 * 
 * @param index      The encoder index (0 = right, 1 = left)
 * @param clockwise  True if encoder rotated clockwise, false if counter-clockwise
 * @return          Always returns false to indicate event was handled
 */
bool encoder_update_user(uint8_t index, bool clockwise) {
    uint8_t layer = get_highest_layer(layer_state);
    bool shift_pressed = get_mods() & MOD_BIT(KC_LSFT);

    if (index == 0) { /* Right encoder */
        switch (layer) {
          case _ADJUST:
            // Cycle through RGB modes
            clockwise ? rgblight_step() : rgblight_step_reverse();
            break;

          case _MEDIA:
            // Volume control
            clockwise ? tap_code(KC_VOLU) : tap_code(KC_VOLD);
            break;

          default: {
            // App switcher (GUI+Tab) functionality
            app_switcher_timer = timer_read();

            if (!app_switcher_active) {
              app_switcher_active = true;
              register_code(KC_LGUI);
            }

            // Tab forward/backward through windows
            if (clockwise) {
              tap_code(KC_TAB);
            } else {
              tap_code16(S(KC_TAB));
            }

            break;
          }
        }
    } else if (index == 1) { /* Left encoder */
        switch (layer) {
          case _MEDIA:
            // Screen brightness control
            clockwise ? tap_code(KC_BRID) : tap_code(KC_BRIU);
            break;

          case _ADJUST:
            // RGB hue/value control based on shift state
            clockwise ? (
              shift_pressed ? rgblight_increase_val() : rgblight_increase_hue()
            ) : (
              shift_pressed ? rgblight_decrease_val() : rgblight_decrease_hue()
            );
            break;

          default:
            // Mouse wheel scrolling
            clockwise ? tap_code(KC_WH_D) : tap_code(KC_WH_U);
            break;
        }
    }
    return false;
}

/*
 * Handles app switcher functionality
 */
void matrix_scan_user(void) {
  if (app_switcher_active && timer_elapsed(app_switcher_timer) > 500) {
    unregister_code(KC_LGUI);
    app_switcher_active = false;
  }
}

/*
 * Processes custom keycodes for OS switching and clipboard operations
 * 
 * This function handles:
 * - Switching between Mac and Windows modes
 * - Cross-platform copy/cut/paste operations that work on both Mac and Windows
 *
 * @param keycode The keycode to process
 * @param record Contains information about the keypress event
 * @return false if the keycode was handled, true to let QMK process it normally
 */
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
    switch (keycode) {
        case MAC_MODE:
            if (record->event.pressed) {
                is_mac_mode = true;
                manual_os_override = true;  // Set manual override
                layer_move(_MAC_MODE);  // Switch to Mac base layer
                rgblight_sethsv(MAC_RED, MAC_GREEN, MAC_BLUE);  // Blue color for Mac
            }
            return false;
        case WIN_MODE:
            if (record->event.pressed) {
                is_mac_mode = false;
                manual_os_override = true;  // Set manual override
                layer_move(_WIN_MODE);  // Switch to Windows base layer
                rgblight_sethsv(WIN_RED, WIN_GREEN, WIN_BLUE);  // Green color for Windows
            }
            return false;
        case GAME_MODE:
            if (record->event.pressed) {
                is_mac_mode = false;  // Use Windows-style shortcuts in gaming mode
                manual_os_override = true;  // Set manual override
                layer_move(_GAME_MODE);  // Switch to Gaming base layer
                rgblight_sethsv(GAMING_RED, GAMING_GREEN, GAMING_BLUE);  // Red color for Gaming
            }
            return false;
        case KC_MY_COPY:
            if (record->event.pressed) {
                if (is_mac_mode) {
                    tap_code16(LGUI(KC_C));
                } else {
                    tap_code16(LCTL(KC_C));
                }
            }
            return false;
        case KC_MY_PASTE:
            if (record->event.pressed) {
                if (is_mac_mode) {
                    tap_code16(LGUI(KC_V));
                } else {
                    tap_code16(LCTL(KC_V));
                }
            }
            return false;
        case KC_MY_CUT:
            if (record->event.pressed) {
                if (is_mac_mode) {
                    tap_code16(LGUI(KC_X));
                } else {
                    tap_code16(LCTL(KC_X));
                }
            }
            return false;
        default:
            return true;
    }
}
