# TextArea PCF Control

This project contains a **React virtual PCF field control** that provides a styled textarea experience matching a question/answer UX pattern.

## What This Control Does

- Renders a title/question, help text, tooltip icon, and a text area input.
- Shows a required indicator and validation message based on the bound column’s required metadata.
- Displays max-length guidance, a progress bar, and live character count.
- Turns the character count red when the configured maximum is reached.
- Supports text wrapping (no horizontal scrollbar) and vertical-only resizing.
- Honors disabled state from control context (`isControlDisabled`).

<img width="653" height="274" alt="image" src="https://github.com/user-attachments/assets/28b575cc-f760-421a-ace6-024f9d981115" />

## Supported Bound Field Types

The bound `TextArea` property is restricted to:

- `SingleLine.Text`
- `Multiple`

## Configurable Input Properties

- `Title`: Question/title text shown above the input.
- `HelpText`: Supporting help text shown under the title.
- `TooltipText`: Tooltip shown when hovering the title info icon.
- `MaxLength`: Maximum character count used by the input and counter UI.

<img width="243" height="467" alt="image" src="https://github.com/user-attachments/assets/16d13eb4-f5da-4e1c-9a4c-02a62c188b3e" />


## Notes

- Required behavior is derived from the Dataverse field metadata (not a separate manifest flag).
- Input updates are buffered/debounced for smoother typing performance.
