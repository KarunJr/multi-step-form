import { type useForm, type FieldErrors, Controller } from "react-hook-form";
import FormField from "./form-field";
import { CardTitle } from "./ui/card";
import type { CompanySchema } from "@/types";
import { useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";

interface CompanyDetailsProps {
    register: ReturnType<typeof useForm<CompanySchema>>["register"];
    errors: FieldErrors<CompanySchema>;
    control?: ReturnType<typeof useForm<CompanySchema>>["control"];
    watch?: ReturnType<typeof useForm<CompanySchema>>["watch"];
}

const CompanyDetails = ({ register, errors }: CompanyDetailsProps) => {
    return (
        <div className="space-y-4">
            <CardTitle>Company Details</CardTitle>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    id="companyName"
                    label="Company Name"
                    register={register}
                    errors={errors}
                    type="text"
                />
                <FormField
                    id="panNumber"
                    label="PAN No."
                    register={register}
                    errors={errors}
                    type="text"
                />
                <FormField
                    id="totalCapitalInvested"
                    label="Capital Invested"
                    register={register}
                    errors={errors}
                    type="number"
                />
                <FormField
                    id="numberOfShareholders"
                    label="No. of Share Holders"
                    register={register}
                    errors={errors}
                    type="number"
                />
            </div>
        </div>
    );
};

const ShareHolderDetails = ({
    register,
    errors,
    control,
    watch,
}: CompanyDetailsProps) => {
    const numberOfShareholders = watch!("numberOfShareholders", 0);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "shareholders",
    });

    useEffect(() => {
        if (fields.length < numberOfShareholders) {
            for (let i = fields.length; i < numberOfShareholders; i++) {
                append({
                    firstName: "",
                    lastName: "",
                    nationality: "Nepali",
                });
            }
        }

        if (fields.length > numberOfShareholders) {
            for (let i = fields.length; i > numberOfShareholders; i--) {
                remove(i - 1);
            }
        }
    }, [numberOfShareholders, fields, append, remove]);

    return (
        <div className="space-y-4 max-h-100 overflow-y-auto">
            <CardTitle>Shareholder Details</CardTitle>
            <div className="flex flex-col gap-3">
                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4">
                        <h3>Shareholder: {index + 1}</h3>
                        <FormField
                            id={`shareholders.${index}.firstName`}
                            label="First Name"
                            register={register}
                            errors={errors}
                            type="text"
                        />

                        <FormField
                            id={`shareholders.${index}.lastName`}
                            label="Last Name"
                            register={register}
                            errors={errors}
                            type="text"
                        />
                        
                        <Controller
                            control={control}
                            name={`shareholders.${index}.nationality`}
                            render={({ field }) => (
                                <div className="space-y-2">
                                    <Label htmlFor={`shareholders.${index}.nationality`}>
                                        Nationality
                                    </Label>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Natioanlity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Nepali">Nepali</SelectItem>
                                            <SelectItem value="Indian">Indian</SelectItem>
                                            <SelectItem value="American">American</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export { CompanyDetails, ShareHolderDetails };
