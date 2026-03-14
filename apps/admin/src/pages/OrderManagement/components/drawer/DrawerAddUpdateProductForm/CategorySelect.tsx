import { useEffect, useState } from "react";
import { Select } from "antd";

const { Option } = Select;

interface Category {
    id: number;
    name: string;
    value: string;
}

interface CategorySelectProps {
    onChange?: (value: string) => void;
    value?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ onChange, value }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetch("../../../../../../public/categories.json")
        .then(response => response.json())
        .then((data: Category[]) => setCategories(data))
        .catch(error => console.error("Error loading categories:", error));
    }, []);

    return (
        <Select placeholder="Select category" onChange={onChange} value={value} style={{ width: "100%" }}>
            {categories.map(category => (
                <Option key={category.id} value={category.value}>
                {category.name}
                </Option>
            ))}
        </Select>
    );
};

export default CategorySelect;
