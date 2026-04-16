import * as React from "react";
import { Textarea } from "@fluentui/react-components";

export interface ITextAreaProps {
  value: string;
  title: string;
  helpText: string;
  tooltipText: string;
  maxLength: number;
  isRequired: boolean;
  isDisabled: boolean;
  onValueChange: (value: string) => void;
  onValueCommit: (value: string) => void;
}

interface ITextAreaState {
  draftValue: string;
}

export class TextArea extends React.Component<ITextAreaProps, ITextAreaState> {
  public constructor(props: ITextAreaProps) {
    super(props);

    this.state = {
      draftValue: props.value,
    };
  }

  public componentDidUpdate(prevProps: ITextAreaProps): void {
    if (prevProps.value !== this.props.value && this.props.value !== this.state.draftValue) {
      this.setState({ draftValue: this.props.value });
    }
  }

  public render(): React.ReactNode {
    const currentLength = this.state.draftValue.length;
    const showRequiredError = this.props.isRequired && currentLength === 0;
    const progressPercent = Math.max(0, Math.min(100, (currentLength / this.props.maxLength) * 100));

    return (
      <div
        style={{
          fontFamily: "Segoe UI, Arial, sans-serif",
          fontSize: "14px",
          color: "#242424",
          width: "100%",
          boxSizing: "border-box",
          border: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          <span style={{ fontSize: "16px", lineHeight: "22px", color: "#201f1e", fontWeight: 600 }}>
            {this.props.title}
            {this.props.isRequired ? <span style={{ color: "#a80000" }}> *</span> : null}
          </span>
          <span
            title={this.props.tooltipText}
            style={{
              cursor: "default",
              color: "#605e5c",
              border: "1px solid #8a8886",
              borderRadius: "50%",
              width: "14px",
              height: "14px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px",
              fontWeight: 600,
              lineHeight: "1",
              userSelect: "none",
            }}
          >
            i
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#605e5c", fontSize: "14px", marginBottom: "8px" }}>
          <span
            style={{
              color: "#605e5c",
              border: "1px solid #c8c6c4",
              borderRadius: "3px",
              width: "14px",
              height: "14px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "1",
              userSelect: "none",
              backgroundColor: "#edebe9",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path
                d="M2.5 3.5A1.5 1.5 0 0 1 4 2h8a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 12 10H8l-2.4 2.1A.5.5 0 0 1 4.8 11.7V10H4a1.5 1.5 0 0 1-1.5-1.5z"
                fill="#605e5c"
              />
            </svg>
          </span>
          <span>{this.props.helpText}</span>
        </div>

        <Textarea
          value={this.state.draftValue}
          disabled={this.props.isDisabled}
          maxLength={this.props.maxLength}
          textarea={{ wrap: "soft" }}
          onChange={(event) => {
            const nextValue = event.currentTarget.value;
            this.setState({ draftValue: nextValue });
            this.props.onValueChange(nextValue);
          }}
          onBlur={() => {
            this.props.onValueCommit(this.state.draftValue);
          }}
          style={{
            width: "100%",
            minHeight: "88px",
            boxSizing: "border-box",
            resize: "vertical",
            overflowY: "auto",
            overflowX: "hidden",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: showRequiredError ? "#a80000" : "#8a8886",
            borderRadius: "2px",
            backgroundColor: "#ffffff",
          }}
        />

        {showRequiredError ? (
          <div style={{ color: "#a80000", fontSize: "12px", marginTop: "4px", textAlign: "left" }}>Please enter your answer.</div>
        ) : null}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "6px",
            marginTop: "10px",
            fontSize: "12px",
            fontWeight: 600,
            textAlign: "right",
            color: "#605e5c",
          }}
        >
          <span>Maximum {this.props.maxLength} characters</span>
          <div
            style={{
              width: "170px",
              height: "4px",
              backgroundColor: "#e1dfdd",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                backgroundColor: showRequiredError ? "#a80000" : "#5b5fc7",
                borderRadius: "999px",
              }}
            />
          </div>
          <span>
            {currentLength} / {this.props.maxLength} Characters
          </span>
        </div>
      </div>
    );
  }
}
