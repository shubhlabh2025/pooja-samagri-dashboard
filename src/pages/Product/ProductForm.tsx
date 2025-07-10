import Checkbox from "@/components/Form/Checkbox";
import ImageInputWithURLAssetToggle from "@/components/Form/ImageInputWithUrlAssetToggle";
import Input from "@/components/Form/Input";
import TextArea from "@/components/Form/TextArea";
import { useState } from "react";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import BackArrow from "../../assets/arrow.png";
import { useNavigate } from "react-router";
import { createProduct } from "@/slices/productSlice";
import type { ProductVariant } from "@/interfaces/product-variant";
import { Plus, X } from "lucide-react";
import CategoriesModal from "@/components/Category/CategoriesModalComponent";
import SubCategoriesModal from "@/components/Category/SubCategoryModalComponent"; // Create as per previous answer

// Zod schema including categories and subcategories
const productVariantSchema = z
  .object({
    id: z.string().optional(),
    product_id: z.string().optional(),
    display_label: z.string().min(1, "Required"),
    name: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    mrp: z.number().min(0, "MRP must be positive"),
    price: z.number().min(0, "Price must be positive"),
    images: z.array(z.string()).min(1, "At least one image required"),
    brand_name: z.string().min(1, "Required"),
    out_of_stock: z.boolean(),
    default_variant: z.boolean(),
    min_quantity: z.number().optional(),
    max_quantity: z.number().optional(),
    total_available_quantity: z.number().min(0, "Must be 0 or more"),
    category_ids: z.array(z.string()).optional(),
    subcategory_ids: z.array(z.string()).optional(),
  })
  .refine((data) => data.price <= data.mrp, {
    message: "Price should not exceed MRP",
    path: ["price"],
  });

// Default variant shape (with categories and subcategories)
const defaultVariant = (): ProductVariant & {
  category_ids: string[];
  subcategory_ids: string[];
} => ({
  id: "",
  product_id: "",
  display_label: "",
  name: "",
  description: "",
  mrp: 0,
  default_variant: true,
  price: 0,
  images: [],
  brand_name: "",
  out_of_stock: false,
  min_quantity: 1,
  max_quantity: 1,
  total_available_quantity: 1,
  category_ids: [],
  subcategory_ids: [],
});

const ProductForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Form state
  const [productName, setProductName] = useState<string>("");
  const [variants, setVariants] = useState<
    (ProductVariant & { category_ids: string[]; subcategory_ids: string[] })[]
  >([{ ...defaultVariant(), name: "" }]);
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>(
    {}
  );
  // Modals control
  const [categoryModalIndex, setCategoryModalIndex] = useState<number | null>(
    null
  );
  const [subCategoryModalIndex, setSubCategoryModalIndex] = useState<
    number | null
  >(null);

  // Categories/subcategories from global state
  const categoriesState = useAppSelector((state) => state.categories);
  const subCategoriesState = useAppSelector((state) => state.subCategories);

  // Utility: get category/subcategory name by id
  const getCategoryName = (id: string) =>
    categoriesState.categories.find((c) => c.id === id)?.name || id;
  const getSubCategoryName = (id: string) =>
    subCategoriesState.subCategories.find((sc) => sc.id === id)?.name || id;

  // Name sync
  const handleProductNameChange = (val: string) => {
    setProductName(val);
    setVariants((prev) => prev.map((v) => ({ ...v, name: val })));
  };

  // Variant update utility
  const updateVariant = <
    K extends keyof (ProductVariant & {
      category_ids: string[];
      subcategory_ids: string[];
    })
  >(
    index: number,
    field: K,
    value: (ProductVariant & {
      category_ids: string[];
      subcategory_ids: string[];
    })[K]
  ) => {
    let updated = [...variants];
    if (field === "default_variant" && value) {
      updated = updated.map((v, i) => ({
        ...v,
        default_variant: i === index,
      }));
    } else if (field === "default_variant" && !value) {
      const isOnlyDefault =
        updated.filter((v) => v.default_variant).length === 1 &&
        updated[index].default_variant;
      if (isOnlyDefault) return;
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

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<number, Record<string, string>> = {};
    let valid = true;
    variants.forEach((variant, idx) => {
      const result = productVariantSchema.safeParse({
        ...variant,
        name: productName,
        mrp: Number(variant.mrp),
        price: Number(variant.price),
        total_available_quantity: Number(variant.total_available_quantity),
        min_quantity: Number(variant.min_quantity),
        max_quantity: Number(variant.max_quantity),
        category_ids: variant.category_ids,
        subcategory_ids: variant.subcategory_ids,
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

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const payload = {
          product_variants: variants.map((variant) => {
            // Merge category_ids and sub_category_ids, remove duplicates
            // const mergedCategoryIds = Array.from(
            //   new Set([
            //     ...(variant.category_ids || []),
            //     ...(variant.subcategory_ids || []),
            //   ])
            // );

            // Omit id, product_id, sub_category_ids
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, product_id, subcategory_ids, ...rest } = variant;

            return {
              ...rest,
              name: productName, // Ensures name is always present (if using root)
              category_ids: variant.category_ids,
              subcategory_ids: variant.subcategory_ids,
            };
          }),
        };
        const response = await dispatch(createProduct(payload));
        if (!response) {
          throw new Error("Failed to submit");
        }
        navigate(-1);
      } catch (error) {
        console.error("Submission error:", error);
      }
    }
  };

  // --- JSX ---
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="flex items-center mb-1">
          <img
            src={BackArrow}
            alt="Back"
            className="w-6 h-6 mr-2 cursor-pointer"
            onClick={() => navigate("../products", { replace: true })}
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

      {/* Each Variant Form */}
      {variants.map((variant, index) => (
        <div
          key={index}
          className="bg-white border border-gray-100 rounded-md p-6 space-y-6 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              value={variant.images}
              error={errors[index]?.image}
              onChange={(val) => updateVariant(index, "images", val)}
            />
          </div>

          {/* Per-variant categories */}
          <div className="mb-2 mt-4">
            <span>Select Categories</span>
          </div>
          <div className="flex items-center flex-wrap gap-2 mb-2 mt-2 px-1">
            {variant.category_ids.map((catId) => (
              <span
                key={catId}
                className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold"
              >
                {getCategoryName(catId)}
                <button
                  onClick={() =>
                    updateVariant(
                      index,
                      "category_ids",
                      variant.category_ids.filter(
                        (id) => id !== catId
                      ) as string[]
                    )
                  }
                  className="ml-1 rounded hover:bg-blue-200 p-1"
                  type="button"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            <button
              type="button"
              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold hover:bg-blue-200"
              onClick={() => setCategoryModalIndex(index)}
            >
              <Plus size={14} className="mr-1" /> Add Categories
            </button>
          </div>
          {/* Category modal for this variant */}
          <CategoriesModal
            open={categoryModalIndex === index}
            selectedCategoryIds={variant.category_ids}
            onClose={() => setCategoryModalIndex(null)}
            onSave={(ids) => {
              updateVariant(index, "category_ids", ids);
              setCategoryModalIndex(null);
            }}
          />

          {/* Per-variant subcategories */}
          <div className="mb-2 mt-4">
            <span>Select Subcategories</span>
          </div>
          <div className="flex items-center flex-wrap gap-2 mb-2 mt-2 px-1">
            {variant.subcategory_ids?.map((subId) => (
              <span
                key={subId}
                className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold"
              >
                {getSubCategoryName(subId)}
                <button
                  onClick={() =>
                    updateVariant(
                      index,
                      "subcategory_ids",
                      variant.subcategory_ids.filter((id) => id !== subId)
                    )
                  }
                  className="ml-1 rounded hover:bg-green-200 p-1"
                  type="button"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            <button
              type="button"
              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold hover:bg-green-200"
              onClick={() => {
                if (variant.category_ids.length === 0) {
                  alert("Please select category first");
                  // OR use a toast/snackbar if you have one
                } else {
                  setSubCategoryModalIndex(index);
                }
              }}
            >
              <Plus size={14} className="mr-1" /> Add Subcategories
            </button>
          </div>
          {/* SubCategory modal for this variant */}
          <SubCategoriesModal
            open={subCategoryModalIndex === index}
            parentCategoryIds={variant.category_ids}
            selectedSubCategoryIds={variant.subcategory_ids}
            onClose={() => setSubCategoryModalIndex(null)}
            onSave={(ids) => {
              updateVariant(index, "subcategory_ids", ids);
              setSubCategoryModalIndex(null);
            }}
          />

          {/* Variant controls */}
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

export default ProductForm;
