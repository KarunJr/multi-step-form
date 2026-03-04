import { type Path, type useForm, type FieldErrors, get } from "react-hook-form";
import { Input } from "./ui/input";
import type { CompanySchema } from "@/types";
import { Label } from "./ui/label";
interface FormFieldProps {
    register: ReturnType<typeof useForm<CompanySchema>>["register"];
    id: Path<CompanySchema>;
    label: string;
    type: string;
    errors: FieldErrors<CompanySchema>;
}

const FormField = ({
    register,
    id,
    label,
    errors,
    type,
}: FormFieldProps) => {
    const error = get(errors, id)    
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type={type}
                {...(type === "text"
                    ? { ...register(id) }
                    : { ...register(id, { valueAsNumber: true }) })}
                className="no-spinner"
            />
            {
                error?.message && (
                    <p className="text-sm text-destructive">
                        {error.message as string}
                    </p>
                )
            }
        </div>
    );
};
export default FormField;
