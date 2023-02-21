interface Props {
    value: any;
    name: string;
    type: string;
    label: string;
    accept: string;
    required: boolean;
    preview?: boolean;
    disabled?: boolean;
    displayName?: string;
    onChange: (e: any) => void;
}

const FileUploadField = ({ value, label, accept, onChange, disabled = false, required, name, type, preview = true, displayName }: Props) => {
    return (
        <div className="w-full">
            <label
                className={
                    "font-Sora w-full flex justify-center py-4 px-4 rounded shadow-sm text-lg font-semibold text-white" + (disabled ? " bg-gray-400 cursor-not-allowed" : " bg-primary cursor-pointer")
                }
                htmlFor={name}
            >
                {label}
            </label>

            {preview &&
                value &&
                ((type === "image" && <img src={value} alt={name} className="mt-4 w-full" />) ||
                    (type === "file" && (
                        <div className="font-Sora mt-3 font-semibold text-primary underline">
                            <a download={true} href={value} rel="noreferrer" target="_blank">
                                {displayName || label}
                            </a>
                        </div>
                    )))}

            <input id={name} name={name} type="file" accept={accept} onChange={onChange} required={required} disabled={disabled} className="hidden" />
        </div>
    );
};

export default FileUploadField;
