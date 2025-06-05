import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  fetchProductById,
  updateProduct,
  deleteProduct,
  updateProductName,
} from "@/slices/productSlice";
import Input from "@/components/Form/Input";
import TextArea from "@/components/Form/TextArea";
import Checkbox from "@/components/Form/Checkbox";
import ImageInputWithURLAssetToggle from "@/components/Form/ImageInputWithUrlAssetToggle";
import type { ProductVariant } from "@/interfaces/product-variant";
import { defaultVariant } from "@/interfaces/product-variant";
import { useParams, useNavigate } from "react-router";
import { z } from "zod";
import { ChevronDown, ChevronUp } from "lucide-react";
import BackArrow from "../../assets/arrow.png"; // Update if needed

const productVariantSchema = z
  .object({
    variant_id: z.string().optional(),
    product_id: z.string().optional(),
    display_label: z.string().min(1, "Required"),
    name: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    mrp: z.number().min(0, "MRP must be positive"),
    price: z.number().min(0, "Price must be positive"),
    image: z.array(z.string()).min(1, "At least one image required"),
    brand_name: z.string().min(1, "Required"),
    out_of_stock: z.boolean(),
    min_quantity: z.number().optional(),
    max_quantity: z.number().optional(),
    total_available_quantity: z.number().min(0, "Must be 0 or more"),
  })
  .refine((data) => data.price <= data.mrp, {
    message: "Price should not exceed MRP",
    path: ["price"],
  });

const UpdateProductForm: React.FC<{ productId?: string }> = ({
  productId: propProductId,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { productId: paramProductId } = useParams<{ productId: string }>();
  const productId = propProductId || paramProductId;

  const productFromStore = useAppSelector((state) =>
    state.products.products.find((p) => p.id === productId)
  );
  const selectedProduct = useAppSelector(
    (state) => state.products.selectedProduct
  );

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [productName, setProductName] = useState<string>("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>(
    {}
  );
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (!productFromStore && productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productFromStore, productId]);

  useEffect(() => {
    const prod = productFromStore || selectedProduct;
    if (prod && prod.product_variants) {
      setVariants(prod.product_variants.map((v) => ({ ...v })));
      setProductName(prod.product_variants[0]?.name ?? "");
    }
  }, [productFromStore, selectedProduct]);

  const handleProductNameChange = (val: string) => {
    setProductName(val);
    setVariants((prev) => prev.map((v) => ({ ...v, name: val })));
  };

  const validate = (): boolean => {
    const newErrors: Record<number, Record<string, string>> = {};
    let valid = true;
    variants.forEach((variant, idx) => {
      const result = productVariantSchema.safeParse({
        ...variant,
        mrp: Number(variant.mrp),
        price: Number(variant.price),
        total_available_quantity: Number(variant.total_available_quantity),
        min_quantity: Number(variant.min_quantity),
        max_quantity: Number(variant.max_quantity),
        name: productName,
      });
      if (!result.success) {
        valid = false;
        newErrors[idx] = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) newErrors[idx][err.path[0] as string] = err.message;
        });
      }
    });
    setErrors(newErrors);
    return valid;
  };

  const updateVariant = <K extends keyof ProductVariant>(
    index: number,
    field: K,
    value: ProductVariant[K]
  ) => {
    let updated = [...variants];
    if (field === "default_variant" && value) {
      // Make this variant default, others false
      updated = updated.map((v, i) => ({
        ...v,
        default_variant: i === index,
      }));
    } else if (field === "default_variant" && !value) {
      // Prevent unchecking if this is the only default
      const isOnlyDefault =
        updated.filter((v) => v.default_variant).length === 1 &&
        updated[index].default_variant;
      if (isOnlyDefault) {
        return;
      }
      updated[index][field] = value;
    } else {
      updated[index][field] = value;
    }
    setVariants(updated);
  };
  const handleSaveProductName = async () => {
    if (!productName) return;
    setSavingName(true);
    try {
      for (let i = 0; i < variants.length; i++) {
        await dispatch(
          updateProductName({
            id: productId ?? "",
            updates: {
              name: productName,
            },
          })
        );
      }
      // Optionally: show toast
    } catch (error) {
      console.error("Failed to save product name", error);
    }
    setSavingName(false);
  };

  const handleSaveVariant = async (index: number) => {
    if (!validate()) return;
    const variant = { ...variants[index], name: productName };
    try {
      await dispatch(
        updateProduct({
          id: variant.id,
          updates: variant,
        })
      );
      // Optionally: show toast
    } catch (error) {
      console.error("Failed to update variant", error);
    }
  };

  const handleDeleteVariant = async (index: number) => {
    const variant = variants[index];
    try {
      await dispatch(deleteProduct(variant.id));
      setVariants((prev) => prev.filter((_, i) => i !== index));
      setExpandedIndex(null);
    } catch (error) {
      console.error("Failed to delete variant", error);
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { ...defaultVariant(), name: productName }]);
    setExpandedIndex(variants.length);
  };

  const handleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <form className="space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        {/* Left Group: Back, Title, Name, Save */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ minWidth: 40, minHeight: 40 }}
          >
            <img src={BackArrow} alt="Back" className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800 mr-2">
            Update Product
          </h2>
        </div>
        {/* Right Group: Create Variant */}
        <button
          type="button"
          onClick={handleAddVariant}
          className="h-12 px-6 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Create Variant
        </button>
      </div>

      <div className="flex items-end gap-3 mb-8">
        <Input
          label="Product Name"
          value={productName}
          error={errors[0]?.name}
          onChange={handleProductNameChange}
        />
        <button
          type="button"
          onClick={handleSaveProductName}
          className="h-9 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
          disabled={savingName || !productName}
        >
          {savingName ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Variant List */}
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div
            key={variant.id || index}
            className="bg-white border border-gray-100 rounded-md shadow-sm"
          >
            {/* Collapsible header */}
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer"
              onClick={() => handleExpand(index)}
            >
              <span className="font-medium text-gray-700">
                {variant.display_label || `Variant ${index + 1}`}
              </span>
              <span>
                {expandedIndex === index ? <ChevronUp /> : <ChevronDown />}
              </span>
            </div>
            {/* Collapsible content */}
            {expandedIndex === index && (
              <div className="p-6 space-y-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Variant Quantity"
                    value={variant.display_label}
                    error={errors[index]?.display_label}
                    onChange={(val) =>
                      updateVariant(index, "display_label", val)
                    }
                  />
                  <Input
                    label="Brand Name"
                    value={variant.brand_name}
                    error={errors[index]?.brand_name}
                    onChange={(val) => updateVariant(index, "brand_name", val)}
                  />
                  <Input
                    label="MRP"
                    type="number"
                    value={variant.mrp?.toString() || ""}
                    error={errors[index]?.mrp}
                    onChange={(val) => updateVariant(index, "mrp", +val)}
                  />
                  <Input
                    label="Price"
                    type="number"
                    value={variant.price?.toString() || ""}
                    error={errors[index]?.price}
                    onChange={(val) => updateVariant(index, "price", +val)}
                  />
                  <Input
                    label="Min Quantity"
                    type="number"
                    value={variant.min_quantity?.toString() || ""}
                    onChange={(val) =>
                      updateVariant(index, "min_quantity", +val)
                    }
                  />
                  <Input
                    label="Max Quantity"
                    type="number"
                    value={variant.max_quantity?.toString() || ""}
                    onChange={(val) =>
                      updateVariant(index, "max_quantity", +val)
                    }
                  />
                  <Input
                    label="Total Available Quantity"
                    type="number"
                    value={variant.total_available_quantity?.toString() || ""}
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
                    onChange={(val) =>
                      updateVariant(index, "out_of_stock", val)
                    }
                  />
                  <Checkbox
                    label="Default Variant"
                    checked={variant.default_variant}
                    onChange={(val) =>
                      updateVariant(index, "default_variant", val)
                    }
                  />
                </div>
                {/* Action buttons */}
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    className="bg-red-100 text-red-700 px-4 py-2 rounded"
                    onClick={() => handleDeleteVariant(index)}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => handleSaveVariant(index)}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </form>
  );
};

export default UpdateProductForm;
