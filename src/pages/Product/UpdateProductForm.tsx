import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchProductById, updateProductName } from "@/slices/productSlice";
import Input from "@/components/Form/Input";
import TextArea from "@/components/Form/TextArea";
import Checkbox from "@/components/Form/Checkbox";
import ImageInputWithURLAssetToggle from "@/components/Form/ImageInputWithUrlAssetToggle";
import type { ProductVariant } from "@/interfaces/product-variant";
import { defaultVariant } from "@/interfaces/product-variant";
import { useParams, useNavigate } from "react-router";
import { z } from "zod";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import BackArrow from "../../assets/arrow.png";
import {
  createProductVariant,
  deleteProductVariant,
  updateProductVariant,
} from "@/slices/productVariantSlice";
import { omitKeys } from "@/utils/Utils";
import DismissDialog from "@/components/Common/DismissDialog";
import CategoriesModal from "@/components/Category/CategoriesModalComponent";
import SubCategoriesModal from "@/components/Category/SubCategoryModalComponent";
import { fetchCategories } from "@/slices/categorySlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { SubCategories } from "@/interfaces/subcategories";

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
    category_ids: z.array(z.string()).optional(),
    subcategory_ids: z.array(z.string()).optional(),
  })
  .refine((data) => data.price <= data.mrp, {
    message: "Price should not exceed MRP",
    path: ["price"],
  });

// Extended ProductVariant interface for local state
interface ExtendedProductVariant extends ProductVariant {
  category_ids: string[];
  subcategory_ids: string[];
}

const UpdateProductForm: React.FC<{ productId?: string }> = ({
  productId: propProductId,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { productId: paramProductId } = useParams<{ productId: string }>();
  const productId = propProductId || paramProductId;
  const [showDialog, setShowDialog] = useState(false);
  const [query] = useState("");

  const productFromStore = useAppSelector((state) =>
    state.products.products.find((p) => p.id === productId),
  );
  const selectedProduct = useAppSelector(
    (state) => state.products.selectedProduct,
  );

  // Categories/subcategories from global state
  const categoriesState = useAppSelector((state) => state.categories);
  const subCategoriesState = useAppSelector((state) => state.subCategories);

  const [variants, setVariants] = useState<ExtendedProductVariant[]>([]);
  const [productName, setProductName] = useState<string>("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>(
    {},
  );
  const [savingName, setSavingName] = useState(false);

  // Modals control
  const [categoryModalIndex, setCategoryModalIndex] = useState<number | null>(
    null,
  );
  const [subCategoryModalIndex, setSubCategoryModalIndex] = useState<
    number | null
  >(null);

  // Utility functions to get category/subcategory names
  const getCategoryName = (id: string) =>
    categoriesState.categories.find((c) => c.id === id)?.name || id;
  const getSubCategoryName = (id: string) =>
    subCategoriesState.subCategories.find((sc) => sc.id === id)?.name || id;

  // Function to extract categories and subcategories from API response
  const extractCategoriesFromVariant = (variant: ProductVariant) => {
    const categories: string[] = [];
    const subcategories: string[] = [];

    if (variant.categories && Array.isArray(variant.categories)) {
      variant.categories.forEach((cat: SubCategories) => {
        if (cat.parent_id === null) {
          // This is a main category
          categories.push(cat.id);
        } else {
          // This is a subcategory
          subcategories.push(cat.id);
        }
      });
    }

    return { categories, subcategories };
  };

  useEffect(() => {
    if (!productFromStore && productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productFromStore, productId]);

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, pageSize: 30, q: query }));
  }, [dispatch, query]);

  useEffect(() => {
    const prod = productFromStore || selectedProduct;
    if (prod && prod.product_variants) {
      const extendedVariants = prod.product_variants.map(
        (v: ProductVariant) => {
          const { categories, subcategories } = extractCategoriesFromVariant(v);
          return {
            ...v,
            category_ids: categories,
            subcategory_ids: subcategories,
          };
        },
      );
      setVariants(extendedVariants);
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

  const updateVariant = <K extends keyof ExtendedProductVariant>(
    index: number,
    field: K,
    value: ExtendedProductVariant[K],
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
          }),
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
    const variant = {
      ...variants[index],
      name: productName,
      product_id: productId ?? "",
    };

    try {
      if (!variant.id) {
        // --- CREATE ---
        const cleaned = omitKeys(variant, [
          "id",
          "categories",
          "createdAt",
          "updatedAt",
        ]);
        const result = await dispatch(createProductVariant(cleaned)).unwrap();
        // Now update the local state with new id
        setVariants((prev) =>
          prev.map((v, i) => (i === index ? { ...v, ...result } : v)),
        );
        toast.success("Variant created successfully");

        // Optionally: show toast
      } else {
        // --- UPDATE ---
        const cleaned = omitKeys(variant, [
          "id",
          "product_id",
          "categories",
          "name",
          "createdAt",
          "updatedAt",
        ]);
        await dispatch(
          updateProductVariant({
            id: variant.id,
            updates: cleaned,
          }),
        );
        toast.success("Variant updated successfully");
        console.log("toast triger");
        // Navigate back after a short delay (optional)
        setTimeout(() => navigate(-1), 1000);
        // Optionally: show toast
      }
    } catch (error) {
      console.error("Failed to save variant", error);
    }
  };

  const handleDeleteVariant = async (index: number) => {
    const variant = variants[index];
    try {
      await dispatch(deleteProductVariant(variant.id));
      setVariants((prev) => prev.filter((_, i) => i !== index));
      setExpandedIndex(null);
    } catch (error) {
      console.error("Failed to delete variant", error);
    }
  };

  const handleAddVariant = () => {
    const newVariant: ExtendedProductVariant = {
      ...defaultVariant(),
      name: productName,
      category_ids: [],
      subcategory_ids: [],
    };
    setVariants([...variants, newVariant]);
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
                    value={variant.images}
                    error={errors[index]?.image}
                    onChange={(val) => updateVariant(index, "images", val)}
                  />
                </div>

                {/* Categories Section */}
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
                        onClick={() => {
                          updateVariant(
                            index,
                            "category_ids",
                            variant.category_ids.filter((id) => id !== catId),
                          );
                          updateVariant(index, "subcategory_ids", []);
                        }}
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

                {/* Subcategories Section */}
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
                            variant.subcategory_ids.filter(
                              (id) => id !== subId,
                            ),
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
                    onClick={() => setShowDialog(true)}
                  >
                    Delete
                  </button>
                  <DismissDialog
                    open={showDialog}
                    title="Delete Product"
                    message="Are you sure you want to delete this Product?."
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    onConfirm={() => {
                      handleDeleteVariant(index);
                      setShowDialog(false);
                    }}
                    onCancel={() => setShowDialog(false)}
                  />
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
