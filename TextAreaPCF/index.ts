import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { TextArea, ITextAreaProps } from "./TextArea";
import * as React from "react";

export class TextAreaPCF implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private currentValue: string;
    private pendingValue: string | null;
    private notifyTimerId: number | undefined;

    private resolveIsRequired(requiredLevel: unknown): boolean {
        if (typeof requiredLevel === "string") {
            const normalizedRequiredLevel = requiredLevel.toLowerCase();
            return normalizedRequiredLevel === "required" || normalizedRequiredLevel === "applicationrequired" || normalizedRequiredLevel === "systemrequired";
        }

        if (typeof requiredLevel === "number") {
            return requiredLevel >= 2;
        }

        if (requiredLevel !== null && requiredLevel !== undefined) {
            try {
                const serializedLevel = JSON.stringify(requiredLevel).toLowerCase();
                return serializedLevel.includes("required") && !serializedLevel.includes("recommended");
            } catch (error) {
                return false;
            }
        }

        return false;
    }

    /**
     * Empty constructor.
     */
    constructor() {
        this.currentValue = "";
        this.pendingValue = null;
        this.notifyTimerId = undefined;
    }

    private queueNotifyOutputChanged(): void {
        if (this.notifyTimerId !== undefined) {
            window.clearTimeout(this.notifyTimerId);
        }

        this.notifyTimerId = window.setTimeout(() => {
            this.notifyTimerId = undefined;
            this.notifyOutputChanged();
        }, 200);
    }

    private flushNotifyOutputChanged(): void {
        if (this.notifyTimerId !== undefined) {
            window.clearTimeout(this.notifyTimerId);
            this.notifyTimerId = undefined;
        }

        this.notifyOutputChanged();
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const boundValue = context.parameters.TextArea.raw ?? "";
        const updatedProperties = context.updatedProperties ?? [];

        if (this.pendingValue === null) {
            this.currentValue = boundValue;
        } else if (boundValue === this.pendingValue) {
            this.currentValue = boundValue;
            this.pendingValue = null;
        } else if (updatedProperties.includes("TextArea")) {
            this.currentValue = boundValue;
            this.pendingValue = null;
        }

        const textAreaParameter = context.parameters.TextArea as ComponentFramework.PropertyTypes.StringProperty & {
            attributes?: {
                RequiredLevel?: unknown;
            };
        };

        const titleRaw = context.parameters.Title.raw?.trim() ?? "";
        const title = titleRaw.length > 0 ? titleRaw : "How do you use your knowledge and skills to help others?";

        const helpTextRaw = context.parameters.HelpText.raw?.trim() ?? "";
        const helpText =
            helpTextRaw.length > 0
                ? helpTextRaw
                : "Examples include promoting diversity and inclusion in your technical community or events, volunteering, coaching, using technology to advance social good, etc.";

        const tooltipTextRaw = context.parameters.TooltipText.raw?.trim() ?? "";
        const tooltipText = tooltipTextRaw.length > 0 ? tooltipTextRaw : "More information";

        const configuredMaxLength = context.parameters.MaxLength.raw ?? 1000;
        const maxLength = configuredMaxLength > 0 ? configuredMaxLength : 1000;

        const requiredLevel = textAreaParameter.attributes?.RequiredLevel;
        const isRequired = this.resolveIsRequired(requiredLevel);
        const isDisabled = (context.mode as { isControlDisabled?: boolean }).isControlDisabled ?? false;

        const props: ITextAreaProps = {
            value: this.currentValue,
            title,
            helpText,
            tooltipText,
            maxLength,
            isRequired,
            isDisabled,
            onValueChange: (value: string) => {
                this.currentValue = value;
                this.pendingValue = value;
                this.queueNotifyOutputChanged();
            },
            onValueCommit: (value: string) => {
                this.currentValue = value;
                this.pendingValue = value;
                this.flushNotifyOutputChanged();
            },
        };

        return React.createElement(
            TextArea, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
            TextArea: this.currentValue,
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        if (this.notifyTimerId !== undefined) {
            window.clearTimeout(this.notifyTimerId);
            this.notifyTimerId = undefined;
        }
    }
}
