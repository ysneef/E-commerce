import { useEffect, useState } from "react";
import { Select } from "antd";

const { Option } = Select;

export interface Category {
    id: number;
    name: string;
    value: string;
}

interface CategorySelectProps {
    onChange?: (value: string) => void;
    value?: string;
    multiple?: "multiple" | "tags" | undefined;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ onChange, value, multiple }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetch("/admin/categories.json")
        .then(response => response.json())
        .then((data: Category[]) => setCategories(data))
        .catch(error => console.error("Error loading categories:", error));
    }, []);

    return (
        <Select 
            {...(multiple ? { mode: multiple } : {})}
            placeholder="Select category" 
            onChange={onChange} 
            value={value} 
            style={{ width: "100%" }}
        >
            {categories.map(category => (
                <Option key={category.id} value={category.value}>
                {category.name}
                </Option>
            ))}
        </Select>
    );
};

export default CategorySelect;
