import Checkbox from "@/components/Form/Checkbox";
import ImageInputWithURLAssetToggle from "@/components/Form/ImageInputWithUrlAssetToggle";
import Input from "@/components/Form/Input";
import TextArea from "@/components/Form/TextArea";
import { useState } from "react";
import { z } from "zod";
import { useAppDispatch } from "@/hooks/reduxHooks";
import BackArrow from "../../assets/arrow.png";
import { useNavigate } from "react-router";
import { createProduct } from "@/slices/productSlice";
import type { ProductVariant } from "@/interfaces/product-variant";

const defaultVariant = (): ProductVariant => ({
  id: "",
  product_id: "",
  display_label: "",
  name: "",
  description: "",
  mrp: 0,
  default_variant: true,
  price: 0,
  image: [],
  brand_name: "",
  out_of_stock: false,
  min_quantity: 1,
  max_quantity: 1,
  total_available_quantity: 0,
});

const productVariantSchema = z
  .object({
    id: z.string().optional(),
    product_id: z.string().optional(),
    display_label: z.string().min(1, "Required"),
    name: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    mrp: z.number().min(0, "MRP must be positive"),
    price: z.number().min(0, "Price must be positive"),
    image: z.array(z.string()).min(1, "At least one image required"),
    brand_name: z.string().min(1, "Required"),
    out_of_stock: z.boolean(),
    default_variant: z.boolean(),
    min_quantity: z.number().optional(),
    max_quantity: z.number().optional(),
    total_available_quantity: z.number().min(0, "Must be 0 or more"),
  })
  .refine((data) => data.price <= data.mrp, {
    message: "Price should not exceed MRP",
    path: ["price"],
  });

const ProductVariantsForm = () => {
  const dispatch = useAppDispatch();
  const [productName, setProductName] = useState<string>("");
  const [variants, setVariants] = useState<ProductVariant[]>([
    { ...defaultVariant(), name: "" },
  ]);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>(
    {}
  );

  // Update all variants' names when root name changes
  const handleProductNameChange = (val: string) => {
    setProductName(val);
    setVariants((prev) => prev.map((v) => ({ ...v, name: val })));
  };

  // Only one variant can be default!
  const updateVariant = <K extends keyof ProductVariant>(
    index: number,
    field: K,
    value: ProductVariant[K]
  ) => {
    let updated = [...variants];
    if (field === "default_variant" && value) {
      updated = updated.map((v, i) => ({
        ...v,
        default_variant: i === index,
      }));
    } else if (field === "default_variant" && !value) {
      // Don't allow unsetting last default
      const isOnlyDefault =
        updated.filter((v) => v.default_variant).length === 1 &&
        updated[index].default_variant;
      if (isOnlyDefault) {
        return; // don't let user unset last default
      }
      updated[index][field] = value;
    } else {
      updated[index][field] = value;
    }
    setVariants(updated);
  };

  const addVariant = () =>
    setVariants([
      ...variants,
      { ...defaultVariant(), name: productName, default_variant: false },
    ]);
  const removeVariant = (index: number) =>
    setVariants(variants.filter((_, i) => i !== index));

  const validate = (): boolean => {
    const newErrors: Record<number, Record<string, string>> = {};
    let valid = true;
    variants.forEach((variant, idx) => {
      const result = productVariantSchema.safeParse({
        ...variant,
        name: productName, // always use the root name!
        mrp: Number(variant.mrp),
        price: Number(variant.price),
        total_available_quantity: Number(variant.total_available_quantity),
        min_quantity: Number(variant.min_quantity),
        max_quantity: Number(variant.max_quantity),
      });

      if (!result.success) {
        valid = false;
        newErrors[idx] = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[idx][err.path[0] as string] = err.message;
          }
        });
      }
    });
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const payload = {
          product_variants: variants.map((v) => ({
            ...v,
            name: productName,
          })),
        };
        const response = await dispatch(createProduct(payload));
        if (!response) {
          throw new Error("Failed to submit");
        }
        console.log("Variants submitted successfully");
        navigate(-1);
      } catch (error) {
        console.error("Submission error:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        {/* Row with arrow and heading */}
        <div className="flex items-center mb-1">
          <img
            src={BackArrow}
            alt="Back"
            className="w-6 h-6 mr-2"
            onClick={() => {
              navigate(-1);
            }}
          />
          <h2 className="text-2xl font-semibold text-gray-800">Add Product</h2>
        </div>
        <p className="text-sm text-gray-500 ml-8">
          Add multiple variants of the same product.
        </p>
      </div>

      {/* Product Name at root level */}
      <div className="flex items-end gap-3 mb-2">
        <Input
          label="Product Name"
          placeholder="Name"
          value={productName}
          error={errors[0]?.name}
          onChange={handleProductNameChange}
        />
      </div>

      {variants.map((variant, index) => (
        <div
          key={index}
          className="bg-white border border-gray-100 rounded-md p-6 space-y-6 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* REMOVE Product Name field here! */}
            <Input
              label="Variant Quantity"
              placeholder="100g"
              value={variant.display_label}
              error={errors[index]?.display_label}
              onChange={(val) => updateVariant(index, "display_label", val)}
            />
            <Input
              label="Brand Name"
              placeholder="Brand Name"
              value={variant.brand_name}
              error={errors[index]?.brand_name}
              onChange={(val) => updateVariant(index, "brand_name", val)}
            />
            <Input
              label="MRP"
              placeholder="100"
              type="number"
              value={variant.mrp.toString()}
              error={errors[index]?.mrp}
              onChange={(val) => updateVariant(index, "mrp", +val)}
            />
            <Input
              label="Price"
              type="number"
              placeholder="100"
              value={variant.price.toString()}
              error={errors[index]?.price}
              onChange={(val) => updateVariant(index, "price", +val)}
            />
            <Input
              label="Min Quantity"
              type="number"
              value={variant.min_quantity?.toString() || ""}
              onChange={(val) => updateVariant(index, "min_quantity", +val)}
            />
            <Input
              label="Max Quantity"
              type="number"
              value={variant.max_quantity?.toString() || ""}
              onChange={(val) => updateVariant(index, "max_quantity", +val)}
            />
            <Input
              label="Total Available Quantity"
              type="number"
              value={variant.total_available_quantity.toString()}
              error={errors[index]?.total_available_quantity}
              onChange={(val) =>
                updateVariant(index, "total_available_quantity", +val)
              }
            />
            <TextArea
              label="Description"
              value={variant.description}
              error={errors[index]?.description}
              onChange={(val) => updateVariant(index, "description", val)}
            />
            <ImageInputWithURLAssetToggle
              label="Images"
              value={variant.image}
              error={errors[index]?.image}
              onChange={(val) => updateVariant(index, "image", val)}
            />
          </div>
          <div>
            <Checkbox
              label="Out of Stock"
              checked={variant.out_of_stock}
              onChange={(val) => updateVariant(index, "out_of_stock", val)}
            />
            <Checkbox
              label="Default Variant"
              checked={variant.default_variant}
              onChange={(val) => updateVariant(index, "default_variant", val)}
            />
          </div>
          {variants.length > 1 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove this variant
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={addVariant}
          className="bg-gray-100 border border-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
        >
          + Add Variant
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ProductVariantsForm;
