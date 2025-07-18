import React, { useEffect, useState, useMemo } from "react";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { SubCategories } from "@/interfaces/subcategories";
import { createSubCategoryApi } from "@/api/subCategoriesApi";
import axiosClient from "@/api/apiClient";
// Assuming your Product interface for the API response
// If Product interface itself already wraps data, adjust accordingly.
// Based on your console log, the top-level Product type should be for the entire response.
// Let's create a wrapper type for the API response.
import type { Product as ProductDataType } from "@/interfaces/product"; // Renamed to avoid confusion

// Define an interface for the full API response structure

const productVariantSchema = z
  .object({
    variant_id: z.string().optional(),
    product_id: z.string().optional(),
    display_label: z.string().min(1, "Required"),
    name: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    mrp: z.number().min(0, "MRP must be positive"),
    price: z.number().min(0, "Price must be positive"),
    images: z.array(z.string()).min(1, "At least one image required"),
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

  const categoriesState = useAppSelector((state) => state.categories);
  const [localSubCategories, setLocalSubCategories] = useState<SubCategories[]>(
    []
  );

  const [variants, setVariants] = useState<ExtendedProductVariant[]>([]);
  const [productName, setProductName] = useState<string>("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>(
    {}
  );
  const [savingName, setSavingName] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const subCategoryApi = useMemo(() => createSubCategoryApi(axiosClient), []);

  const [categoryModalIndex, setCategoryModalIndex] = useState<number | null>(
    null
  );
  const [subCategoryModalIndex, setSubCategoryModalIndex] = useState<
    number | null
  >(null);

  const getCategoryName = (id: string) =>
    categoriesState.categories.find((c) => c.id === id)?.name || id;
  const getSubCategoryName = (id: string) =>
    localSubCategories.find((sc) => sc.id === id)?.name || id;

  const extractCategoriesFromVariant = (variant: ProductVariant) => {
    const categories: string[] = [];
    const subcategories: string[] = [];

    if (variant.categories && Array.isArray(variant.categories)) {
      variant.categories.forEach((cat: SubCategories) => {
        // Based on your API response, categories explicitly have parent_id: null for main categories
        if (cat.parent_id === null) {
          categories.push(cat.id);
        } else if (cat.parent_id) {
          // If parent_id exists and is not null, it's a subcategory
          subcategories.push(cat.id);
        }
      });
    }

    return { categories, subcategories };
  };

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      if (!productId) {
        console.warn("No productId provided. Cannot fetch product details.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log(`Fetching product with ID: ${productId}`);

        // IMPORTANT CHANGE HERE: productResult is the entire API response object
        const productResult: ProductDataType = await dispatch(
          fetchProductById(productId)
        ).unwrap();

        // Access the actual product data from the 'data' property
        // const productResult: ProductDataType = productApiResponseEntity.data;

        console.log("Fetching all categories...");
        const categoriesResult = await dispatch(
          fetchCategories({ page: 1, pageSize: 30, q: query })
        ).unwrap();
        console.log("Categories fetched:", categoriesResult);

        const categoryIds = categoriesResult.categories.map((c) => c.id);
        console.log("Main category IDs for subcategory fetch:", categoryIds);

        if (categoryIds.length > 0) {
          console.log("Fetching subcategories...");
          const params = {}; // Or get it from the outer scope if it exists

          const subRes = await subCategoryApi.getSubCategoriesById({
            ...params, // Spreads any existing page, pageSize from the outer 'params'
            ids: [...categoryIds], // 'ids' should be an array of strings
          });

          setLocalSubCategories(subRes.data?.data || []);
          console.log("Subcategories fetched:", subRes.data?.data);
        } else {
          setLocalSubCategories([]);
          console.log("No main categories found, skipping subcategory fetch.");
        }

        let processedVariants: ExtendedProductVariant[] = [];
        // Now, correctly access product_variants from productResult.data
        if (
          productResult?.product_variants &&
          productResult.product_variants.length > 0
        ) {
          console.log(
            "Processing product variants from fetched product data..."
          );
          processedVariants = productResult.product_variants.map(
            (v: ProductVariant) => {
              const { categories, subcategories } =
                extractCategoriesFromVariant(v);
              return {
                ...v,
                category_ids: categories,
                subcategory_ids: subcategories,
              };
            }
          );
          setProductName(productResult.product_variants[0]?.name ?? "");
        } else {
          console.log(
            "No product variants found in product data or productResult.product_variants is empty."
          );
          setProductName("");
        }
        setVariants(processedVariants);
        console.log("Variants state updated:", processedVariants);
      } catch (err) {
        console.error("Failed to fetch product or categories:", err);
        toast.error("Failed to load product details.");
        setVariants([]);
        setProductName("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndCategories();
  }, [dispatch, productId, query, subCategoryApi]);

  const handleProductNameChange = (val: string) => {
    console.log("handleProductNameChange");
    console.log(val);
    setProductName(val);
   // setVariants((prev) => prev.map((v) => ({ ...v, name: val })));
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
    value: ExtendedProductVariant[K]
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
    console.log("updating name");
    const currentVariantName = variants[0]?.name;
    console.log(currentVariantName);
    console.log(productName);
    console.log(productId);

    if (!productName || !productId || productName === currentVariantName) {
      if (!productName) toast.error("Product name cannot be empty.");
      return;
    }
    console.log("updating name1");

    setSavingName(true);
    try {
      await dispatch(
        updateProductName({
          id: productId,
          updates: {
            name: productName,
          },
        })
      ).unwrap();
      setVariants((prev) => prev.map((v) => ({ ...v, name: productName })));
    } catch (error) {
      console.error("Failed to save product name", error);
      toast.error("Failed to update product name.");
    } finally {
      setSavingName(false);
    }
  };

  const handleSaveVariant = async (index: number) => {
    if (!validate()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    const variantToSave = {
      ...variants[index],
      name: productName,
      product_id: productId ?? "",
    };

    try {
      if (!variantToSave.id) {
        const cleaned = omitKeys(variantToSave, [
          "id",
          "categories",
          "createdAt",
          "updatedAt",
          "category_ids",
          "subcategory_ids",
        ]);

        const payload = {
          ...cleaned,
          product_id: productId!,
          category_ids: variants[index].category_ids,
          subcategory_ids: variants[index].subcategory_ids,
        };

        const result = await dispatch(createProductVariant(payload)).unwrap();

        setVariants((prev) =>
          prev.map((v, i) => (i === index ? { ...v, ...result } : v))
        );
        toast.success("Variant created successfully");
      } else {
        const cleaned = omitKeys(variantToSave, [
          "id",
          "product_id",
          "categories",
          "name",
          "createdAt",
          "updatedAt",
          "category_ids",
          "subcategory_ids",
        ]);

        const payload = {
          ...cleaned,
          category_ids: variants[index].category_ids,
          subcategory_ids: variants[index].subcategory_ids,
        };

        await dispatch(
          updateProductVariant({
            id: variantToSave.id,
            updates: payload,
          })
        ).unwrap();
        toast.success("Variant updated successfully");
      }
    } catch (error) {
      console.error("Failed to save variant", error);
      toast.error("Failed to save variant.");
    }
  };

  const handleDeleteVariant = async (index: number) => {
    const variant = variants[index];
    if (!variant.id) {
      setVariants((prev) => prev.filter((_, i) => i !== index));
      setExpandedIndex(null);
      toast.info("Unsaved variant removed.");
      return;
    }
    setShowDialog(true);
  };

  const handleConfirmDelete = async (index: number) => {
    const variant = variants[index];
    try {
      await dispatch(deleteProductVariant(variant.id)).unwrap();
      setVariants((prev) => prev.filter((_, i) => i !== index));
      setExpandedIndex(null);
      toast.success("Variant deleted successfully");
    } catch (error) {
      console.error("Failed to delete variant", error);
      toast.error("Failed to delete variant.");
    } finally {
      setShowDialog(false);
    }
  };

  const handleAddVariant = () => {
    const newVariant: ExtendedProductVariant = {
      ...defaultVariant(),
      name: productName,
      product_id: productId || "",
      category_ids: [],
      subcategory_ids: [],
    };
    setVariants([...variants, newVariant]);
    setExpandedIndex(variants.length);
  };

  const handleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading product details...</p>
      </div>
    );
  }

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
        {variants.length > 0 ? (
          variants.map((variant, index) => (
            <div
              key={variant.id || `new-${index}`}
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
                      onChange={(val) =>
                        updateVariant(index, "brand_name", val)
                      }
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
                      onChange={(val) =>
                        updateVariant(index, "description", val)
                      }
                    />

                    <ImageInputWithURLAssetToggle
                      label="Images"
                      value={variant.images}
                      error={errors[index]?.images}
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
                              variant.category_ids.filter((id) => id !== catId)
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
                                (id) => id !== subId
                              )
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
                          toast.warn("Please select a category first.");
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
                      onClick={() => handleDeleteVariant(index)}
                    >
                      Delete
                    </button>
                    <DismissDialog
                      open={showDialog}
                      title="Delete Product"
                      message="Are you sure you want to delete this Product Variant? This action cannot be undone."
                      confirmLabel="Delete"
                      cancelLabel="Cancel"
                      onConfirm={() => handleConfirmDelete(index)}
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
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No variants found for this product. Click "Create Variant" to add
            one.
          </p>
        )}
      </div>
    </form>
  );
};

export default UpdateProductForm;
