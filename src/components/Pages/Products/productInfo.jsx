import { useEffect, useState } from "react";
import Sidebar from "../../Common/SideBar/sidebar";
import Navbar from "../../Common/Navbar/navbar";
import {
  getData,
  postData,
  postFormData,
  updateData,
  deleteData,
} from "../../Common/APIs/api";
import { toastSuccess, toastError } from "../../../Services/toast.service";
import { useForm } from "react-hook-form";

/* ── helpers ──────────────────────────────────────────────────────────────── */
const parseImages = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
};

const parseWeight = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [String(val)];
  } catch {
    return [String(val)];
  }
};

/* ── WeightTagInput: dynamic weight chips ─────────────────────────────────── */
const WeightTagInput = ({ weights, setWeights }) => {
  const [input, setInput] = useState("");

  const addWeight = () => {
    const v = input.trim();
    if (v && !weights.includes(v)) setWeights([...weights, v]);
    setInput("");
  };

  const removeWeight = (i) => setWeights(weights.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="d-flex gap-2 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="e.g. 500ml, 1kg …"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addWeight();
            }
          }}
        />
        <button
          type="button"
          className="btn btn-outline-secondary px-3"
          onClick={addWeight}
        >
          Add
        </button>
      </div>
      <div className="d-flex flex-wrap gap-2">
        {weights.map((w, i) => (
          <span
            key={i}
            className="badge rounded-pill px-3 py-2"
            style={{
              background: "#ede7f6",
              color: "#6c3dbf",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {w}
            <i
              className="bi bi-x ms-2"
              style={{ cursor: "pointer" }}
              onClick={() => removeWeight(i)}
            ></i>
          </span>
        ))}
        {weights.length === 0 && (
          <small className="text-muted">
            No weights added yet. Type and press Enter or +
          </small>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════ */
const ProductInfo = () => {
  /* ── Category State ────────────────────────────────────────────────────── */
  const [categories, setCategories] = useState([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [catForm, setCatForm] = useState({
    category_name: "",
    category_description: "",
    is_featured: false,
    is_active: true,
  });
  const [editCat, setEditCat] = useState(null); // null = add mode, object = edit mode
  const [catSubmitting, setCatSubmitting] = useState(false);
  const [deleteCatTarget, setDeleteCatTarget] = useState(null);
  const [deletingCat, setDeletingCat] = useState(false);

  /* ── Fetch Categories ───────────────────────────────────────────────────── */
  const fetchCategories = async () => {
    setCatLoading(true);
    try {
      const res = await getData("category/get-category");
      if (res?.success) setCategories(res.categories || res.data || []);
      else setCategories(res || []);
    } catch (e) {
      console.log("Category fetch error:", e);
    } finally {
      setCatLoading(false);
    }
  };

  /* ── Add Category ───────────────────────────────────────────────────────── */
  const handleAddCategory = async () => {
    if (!catForm.category_name.trim()) {
      toastError("Category name is required.");
      return;
    }
    setCatSubmitting(true);
    try {
      const res = await postData("category/add-category", {
        category_name: catForm.category_name,
        category_description: catForm.category_description,
        is_featured: catForm.is_featured ? 1 : 0,
        is_active: catForm.is_active ? 1 : 0,
      });
      if (res?.data?.success || res?.status === 200 || res?.status === 201) {
        toastSuccess("Category added successfully!");
        setCatForm({
          category_name: "",
          category_description: "",
          is_featured: false,
          is_active: true,
        });
        fetchCategories();
      } else {
        toastError(res?.data?.message || "Failed to add category.");
      }
    } catch (e) {
      toastError(e?.message || "Failed to add category.");
    } finally {
      setCatSubmitting(false);
    }
  };

  /* ── Update Category ────────────────────────────────────────────────────── */
  const handleUpdateCategory = async () => {
    if (!catForm.category_name.trim()) {
      toastError("Category name is required.");
      return;
    }
    setCatSubmitting(true);
    try {
      const res = await updateData(
        "update-category",
        editCat.id || editCat.category_id,
        {
          category_name: catForm.category_name,
          category_description: catForm.category_description,
          is_featured: catForm.is_featured ? 1 : 0,
          is_active: catForm.is_active ? 1 : 0,
        },
      );
      if (res?.data?.success || res?.status === 200) {
        toastSuccess("Category updated!");
        setEditCat(null);
        setCatForm({
          category_name: "",
          category_description: "",
          is_featured: false,
          is_active: true,
        });
        fetchCategories();
      } else {
        toastError(res?.data?.message || "Failed to update.");
      }
    } catch (e) {
      toastError(e?.message || "Failed to update category.");
    } finally {
      setCatSubmitting(false);
    }
  };

  /* ── Delete Category ────────────────────────────────────────────────────── */
  const handleDeleteCategory = async () => {
    if (!deleteCatTarget) return;
    setDeletingCat(true);
    try {
      const res = await deleteData(
        "delete-category",
        deleteCatTarget.id || deleteCatTarget.category_id,
      );
      if (res?.success || res?.status === 200) {
        toastSuccess("Category deleted!");
        setDeleteCatTarget(null);
        fetchCategories();
      } else {
        toastError(res?.message || "Failed to delete.");
      }
    } catch (e) {
      toastError(e?.message || "Failed to delete category.");
    } finally {
      setDeletingCat(false);
    }
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── Add Modal ─────────────────────────────────────────────────────────── */
  const [showAdd, setShowAdd] = useState(false);
  const [addImages, setAddImages] = useState([]);
  const [addPreviews, setAddPreviews] = useState([]);
  const [addWeights, setAddWeights] = useState([]); // weight array for Add

  /* ── Edit Modal ────────────────────────────────────────────────────────── */
  const [showEdit, setShowEdit] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editWeights, setEditWeights] = useState([]); // weight array for Edit

  /* ── Image management inside Edit modal ────────────────────────────────── */
  const [moreImages, setMoreImages] = useState([]); // files for /add-images
  const [morePreviews, setMorePreviews] = useState([]);
  const [imgUploading, setImgUploading] = useState(false);

  /* ── Delete confirm state ──────────────────────────────────────────────── */
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ── react-hook-form: Add ─────────────────────────────────────────────── */
  const {
    register: rAdd,
    handleSubmit: hsAdd,
    reset: resetAdd,
    setValue: setAddValue,
    formState: { errors: eAdd, isSubmitting: addingProduct },
  } = useForm({
    defaultValues: {
      product_name: "",
      product_price: "",
      product_purchase_price: "",
      product_del_price: "",
      product_stock: 0,
      category_name: "",
      category_id: "",
      is_featured: false,
      is_active: true,
    },
  });

  /* ── react-hook-form: Edit ────────────────────────────────────────────── */
  const {
    register: rEdit,
    handleSubmit: hsEdit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: eEdit, isSubmitting: updatingProduct },
  } = useForm();

  /* ── fetch ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getData("products/get_all_products");
      if (res?.success) setProducts(res.products || []);
    } catch (e) {
      console.log("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  /* ── delete product (DELETE /products/delete-product/:id) ─────────────── */
  const confirmDelete = async () => {
    console.log("deleteTarget", deleteTarget);
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteData("products/delete-product", deleteTarget.id);
      if (res?.success) {
        toastSuccess(`"${deleteTarget.product_name}" deleted!`);
        setDeleteTarget(null);
        fetchProducts();
      } else {
        toastError(res?.message || "Failed to delete.");
      }
    } catch (err) {
      console.log("Delete error:", err);
      toastError(err?.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  /* ── open edit modal ──────────────────────────────────────────────────── */

  const openEdit = (p) => {
    setEditProduct(p);
    setEditWeights(parseWeight(p.product_weight));
    setMoreImages([]);
    setMorePreviews([]);
    resetEdit({
      product_name: p.product_name,
      product_price: p.product_price,
      product_purchase_price: p.product_purchase_price,
      product_del_price: p.product_del_price,
      product_stock: p.product_stock,
      category_name: p.category_name,
      category_id: p.category_id ?? "",
      is_featured: !!p.is_featured,
      is_active: !!p.is_active,
    });
    setShowEdit(true);
  };

  /* ── Add: image helpers ───────────────────────────────────────────────── */
  const onAddImageChange = (e) => {
    const files = Array.from(e.target.files);
    setAddImages(files);
    setAddPreviews(files.map((f) => URL.createObjectURL(f)));
  };
  const removeAddPreview = (i) => {
    setAddImages((p) => p.filter((_, idx) => idx !== i));
    setAddPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  /* ── Edit: replace single image (POST /replace-image) ────────────────── */
  const handleReplaceImage = async (replaceIndex, file) => {
    if (!file) return;
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append("id", editProduct.id);
      fd.append("replace_index", replaceIndex);
      fd.append("image", file);
      const res = await postFormData("products/replace-image", fd);
      if (res?.data?.success) {
        toastSuccess("Image replaced!");
        // refresh editProduct images
        await fetchProducts();
        // update local editProduct so images re-render
        setEditProduct((prev) => {
          const imgs = parseImages(prev.product_images);
          imgs[replaceIndex] = res.data.new_url || imgs[replaceIndex];
          return { ...prev, product_images: imgs };
        });
      }
    } catch (err) {
      console.log("Replace error:", err);
      toastError("Failed to replace image.");
    } finally {
      setImgUploading(false);
    }
  };

  /* ── Edit: add more images (POST /add-images) ─────────────────────────── */
  const handleAddMoreImages = async () => {
    console.log("editProduct--------", editProduct);
    if (!moreImages.length) return;
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append("id", editProduct.id);
      moreImages.forEach((f) => fd.append("images", f));
      const res = await postFormData("products/add-images", fd);
      if (res?.data?.success) {
        toastSuccess("Images added!");
        setMoreImages([]);
        setMorePreviews([]);
        await fetchProducts();
        // also update local editProduct
        setEditProduct((prev) => {
          const imgs = parseImages(prev.product_images);
          return {
            ...prev,
            product_images: [...imgs, ...(res.data.new_urls || [])],
          };
        });
      }
    } catch (err) {
      console.log("Add images error:", err);
      toastError("Failed to add images.");
    } finally {
      setImgUploading(false);
    }
  };

  const onMoreImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setMoreImages(files);
    setMorePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  /* ── submit: Add Product ──────────────────────────────────────────────── */
  const onAddProduct = async (data) => {
    // if (addImages.length < 4) {
    //   toastError("Minimum 4 images are required.");
    //   return;
    // }
    // if (addWeights.length === 0) {
    //   toastError("Add at least one weight variant.");
    //   return;
    // }
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === "is_featured" || k === "is_active") fd.append(k, v ? 1 : 0);
        else fd.append(k, v ?? "");
      });
      fd.append("product_weight", JSON.stringify(addWeights));
      addImages.forEach((f) => fd.append("images", f));

      const res = await postFormData("products/add-product", fd);
      if (res?.data?.success) {
        toastSuccess("Product added successfully!");
        setShowAdd(false);
        resetAdd();
        setAddImages([]);
        setAddPreviews([]);
        setAddWeights([]);
        fetchProducts();
      }
    } catch (err) {
      console.log("Add error:", err);
      toastError(err?.message || "Failed to add product.");
    }
  };

  /* ── submit: Edit Product ─────────────────────────────────────────────── */
  const onEditProduct = async (data) => {
    if (editWeights.length === 0) {
      toastError("Add at least one weight variant.");
      return;
    }
    try {
      const payload = {
        product_name: data.product_name,
        product_price: data.product_price,
        product_weight: JSON.stringify(editWeights),
        product_purchase_price: data.product_purchase_price,
        product_del_price: data.product_del_price,
        product_stock: data.product_stock,
        category_name: data.category_name,
        category_id: data.category_id,
        is_featured: data.is_featured ? 1 : 0,
        is_active: data.is_active ? 1 : 0,
        // NOTE: product_images intentionally NOT included here.
        // Base64 image strings are too large for JSON PUT body (~750KB+ for 3 images).
        // Images are managed exclusively via /replace-image and /add-images endpoints.
      };
      const res = await updateData(
        "products/update-product",
        editProduct.id,
        payload,
      );
      if (res?.data?.success) {
        toastSuccess("Product updated successfully!");
        setShowEdit(false);
        fetchProducts();
      }
    } catch (err) {
      console.log("Edit error:", err);
      toastError(err?.message || "Failed to update product.");
    }
  };

  /* ════════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <div
        style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}
      >
        <Sidebar />

        <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
          <Navbar />

          <div style={{ padding: "24px 28px" }}>
            {/* ── Header ──────────────────────────────────────────────── */}
            <div
              className="d-flex justify-content-between align-items-center mb-4 flex-wrap"
              style={{ gap: "12px" }}
            >
              <div>
                <h1 className="page-title">Product Management</h1>
                <p className="page-subtitle">Manage your product catalogue</p>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn px-4"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "13px",
                    boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
                    padding: "9px 18px",
                  }}
                  onClick={() => {
                    setEditCat(null);
                    setCatForm({ name: "", description: "" });
                    setDeleteCatTarget(null);
                    setShowCatModal(true);
                  }}
                >
                  <i className="bi bi-tags me-2" />
                  Manage Categories
                </button>
                <button
                  className="btn px-4"
                  style={{
                    background: "linear-gradient(135deg, #e07a5f, #c96745)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "13px",
                    boxShadow: "0 2px 8px rgba(224, 122, 95, 0.3)",
                    padding: "9px 18px",
                  }}
                  onClick={() => {
                    setAddWeights([]);
                    setShowAdd(true);
                  }}
                >
                  <i className="bi bi-plus-circle me-2" />
                  Add Product
                </button>
              </div>
            </div>

            {/* ── Table ───────────────────────────────────────────────── */}
            <div
              style={{
                background: "white",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              {loading ? (
                <div className="text-center py-5">
                  <div
                    className="spinner-border"
                    role="status"
                    style={{ color: "#e07a5f" }}
                  />
                  <p
                    className="mt-3"
                    style={{ color: "#94a3b8", fontSize: "13px" }}
                  >
                    Loading products...
                  </p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                    📦
                  </div>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "14px",
                      marginBottom: 0,
                    }}
                  >
                    No products found
                  </p>
                </div>
              ) : (
                <div className="table-responsive" style={{ minHeight: "auto" }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr
                        style={{
                          background:
                            "linear-gradient(135deg, #1e293b, #334155)",
                          color: "#fff",
                        }}
                      >
                        <th
                          className="py-3 ps-4"
                          style={{
                            width: 50,
                            fontWeight: 600,
                            fontSize: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            border: "none",
                          }}
                        >
                          #
                        </th>
                        <th
                          style={{
                            fontWeight: 600,
                            fontSize: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            border: "none",
                          }}
                        >
                          Product Name
                        </th>
                        <th
                          style={{
                            fontWeight: 600,
                            fontSize: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            border: "none",
                          }}
                        >
                          Category
                        </th>
                        <th
                          style={{
                            fontWeight: 600,
                            fontSize: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            border: "none",
                          }}
                        >
                          Weights
                        </th>
                        <th
                          style={{
                            fontWeight: 600,
                            fontSize: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            border: "none",
                          }}
                        >
                          Purchase ₹
                        </th>
                        <th
                          style={{
                            fontWeight: 600,
                            fontSize: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            border: "none",
                          }}
                        >
                          Selling ₹
                        </th>
                        <th
                          style={{
                            fontWeight: 600,
                            fontSize: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            border: "none",
                          }}
                        >
                          MRP ₹
                        </th>
                        <th
                          style={{
                            fontWeight: 600,
                            fontSize: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            border: "none",
                          }}
                        >
                          Stock
                        </th>
                        <th
                          className="text-center"
                          style={{
                            fontWeight: 600,
                            fontSize: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            border: "none",
                          }}
                        >
                          Status
                        </th>
                        <th
                          className="text-center pe-4"
                          style={{
                            fontWeight: 600,
                            fontSize: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            border: "none",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p, i) => (
                        <tr
                          key={p.id}
                          style={{ borderBottom: "1px solid #f1f5f9" }}
                        >
                          <td
                            className="ps-4"
                            style={{ color: "#94a3b8", fontSize: "13px" }}
                          >
                            {i + 1}
                          </td>
                          <td
                            style={{
                              fontWeight: 600,
                              color: "#0f172a",
                              fontSize: "13px",
                            }}
                          >
                            {p.product_name}
                          </td>
                          <td>
                            <span
                              style={{
                                background: "rgba(124, 58, 237, 0.1)",
                                color: "#7c3aed",
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "4px 10px",
                                borderRadius: "20px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {p.category_name}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {parseWeight(p.product_weight).map((w, wi) => (
                                <span
                                  key={wi}
                                  style={{
                                    background: "#f1f5f9",
                                    color: "#475569",
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    padding: "3px 8px",
                                    borderRadius: "6px",
                                    border: "1px solid #e2e8f0",
                                  }}
                                >
                                  {w}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td style={{ color: "#64748b", fontSize: "13px" }}>
                            ₹{p.product_purchase_price}
                          </td>
                          <td
                            style={{
                              fontWeight: 700,
                              color: "#059669",
                              fontSize: "13px",
                            }}
                          >
                            ₹{p.product_price}
                          </td>
                          <td
                            style={{
                              textDecoration: "line-through",
                              color: "#94a3b8",
                              fontSize: "13px",
                            }}
                          >
                            ₹{p.product_del_price}
                          </td>
                          <td>
                            <span
                              style={{
                                background:
                                  p.product_stock > 0
                                    ? "rgba(16, 185, 129, 0.1)"
                                    : "rgba(239, 68, 68, 0.1)",
                                color:
                                  p.product_stock > 0 ? "#059669" : "#dc2626",
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "4px 10px",
                                borderRadius: "20px",
                              }}
                            >
                              {p.product_stock ?? 0}
                            </span>
                          </td>
                          <td className="text-center">
                            <span
                              style={{
                                background: p.is_active
                                  ? "rgba(16, 185, 129, 0.1)"
                                  : "rgba(100, 116, 139, 0.1)",
                                color: p.is_active ? "#059669" : "#64748b",
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "4px 10px",
                                borderRadius: "20px",
                              }}
                            >
                              {p.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="text-center pe-4">
                            <div className="d-flex gap-2 justify-content-center">
                              <button
                                className="btn btn-sm px-3"
                                style={{
                                  background: "rgba(79, 70, 229, 0.1)",
                                  color: "#4f46e5",
                                  border: "1px solid rgba(79, 70, 229, 0.2)",
                                  borderRadius: "8px",
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  transition: "all 0.2s ease",
                                }}
                                onClick={() => openEdit(p)}
                              >
                                <i className="bi bi-pencil-square me-1" />
                                Edit
                              </button>
                              <button
                                className="btn btn-sm px-3"
                                style={{
                                  background: "rgba(239, 68, 68, 0.1)",
                                  color: "#dc2626",
                                  border: "1px solid rgba(239, 68, 68, 0.2)",
                                  borderRadius: "8px",
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  transition: "all 0.2s ease",
                                }}
                                onClick={() => setDeleteTarget(p)}
                              >
                                <i className="bi bi-trash3 me-1" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          ADD PRODUCT MODAL
      ════════════════════════════════════════════════════════════════════ */}
      {showAdd && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 1050,
            overflowY: "auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "30px 12px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAdd(false);
              resetAdd();
              setAddImages([]);
              setAddPreviews([]);
              setAddWeights([]);
            }
          }}
        >
          <div
            style={{ width: "100%", maxWidth: 860 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content rounded-4 shadow-lg border-0"
              style={{ background: "#fff" }}
            >
              <div
                className="modal-header text-white px-4 py-3"
                style={{
                  background: "linear-gradient(135deg,#11998e,#38ef7d)",
                  borderRadius: "16px 16px 0 0",
                }}
              >
                <h5 className="modal-title fw-bold mb-0">
                  <i className="bi bi-plus-circle me-2"></i>Add New Product
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowAdd(false);
                    resetAdd();
                    setAddImages([]);
                    setAddPreviews([]);
                    setAddWeights([]);
                  }}
                />
              </div>

              <div className="modal-body p-4" style={{ background: "#fff" }}>
                <form id="addProductForm" onSubmit={hsAdd(onAddProduct)}>
                  <div className="row g-3">
                    {/* Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">
                        Product Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${eAdd.product_name ? "is-invalid" : ""}`}
                        placeholder="e.g. Pure Desi Ghee"
                        {...rAdd("product_name", {
                          required: "Product name is required",
                        })}
                      />
                      {eAdd.product_name && (
                        <div className="invalid-feedback">
                          {eAdd.product_name.message}
                        </div>
                      )}
                    </div>

                    {/* Category */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${eAdd.category_name ? "is-invalid" : ""}`}
                        {...rAdd("category_name", {
                          required: "Category is required",
                        })}
                        onChange={(e) => {
                          const selected = categories.find(
                            (c) =>
                              (c.name || c.category_name) === e.target.value,
                          );
                          setAddValue("category_name", e.target.value);
                          setAddValue(
                            "category_id",
                            selected?.id || selected?.category_id || "",
                          );
                        }}
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat, ci) => (
                          <option
                            key={cat.id || cat.category_id || ci}
                            value={cat.name || cat.category_name}
                          >
                            {cat.name || cat.category_name}
                          </option>
                        ))}
                      </select>
                      {eAdd.category_name && (
                        <div className="invalid-feedback">
                          {eAdd.category_name.message}
                        </div>
                      )}
                    </div>

                    {/* Weight Tags */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        Weight Variants <span className="text-danger">*</span>{" "}
                        <span className="text-muted fw-normal">
                          (e.g. 500ml, 1kg — press Enter or + to add)
                        </span>
                      </label>
                      <WeightTagInput
                        weights={addWeights}
                        setWeights={setAddWeights}
                      />
                    </div>

                    {/* Purchase Price */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">
                        Purchase Price (₹){" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className={`form-control ${eAdd.product_purchase_price ? "is-invalid" : ""}`}
                          placeholder="0.00"
                          {...rAdd("product_purchase_price", {
                            required: "Required",
                            min: { value: 0, message: "≥ 0" },
                          })}
                        />
                        {eAdd.product_purchase_price && (
                          <div className="invalid-feedback">
                            {eAdd.product_purchase_price.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selling Price */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">
                        Selling Price (₹) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className={`form-control ${eAdd.product_price ? "is-invalid" : ""}`}
                          placeholder="0.00"
                          {...rAdd("product_price", {
                            required: "Required",
                            min: { value: 0, message: "≥ 0" },
                          })}
                        />
                        {eAdd.product_price && (
                          <div className="invalid-feedback">
                            {eAdd.product_price.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* MRP */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">
                        MRP (₹) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className={`form-control ${eAdd.product_del_price ? "is-invalid" : ""}`}
                          placeholder="0.00"
                          {...rAdd("product_del_price", {
                            required: "Required",
                            min: { value: 0, message: "≥ 0" },
                          })}
                        />
                        {eAdd.product_del_price && (
                          <div className="invalid-feedback">
                            {eAdd.product_del_price.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stock */}
                    <div className="col-md-3">
                      <label className="form-label fw-semibold small">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        {...rAdd("product_stock", {
                          min: { value: 0, message: "≥ 0" },
                        })}
                      />
                    </div>

                    {/* Toggles */}
                    <div className="col-md-3 d-flex align-items-end pb-1">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="add_featured"
                          {...rAdd("is_featured")}
                        />
                        <label
                          className="form-check-label fw-semibold small"
                          htmlFor="add_featured"
                        >
                          Featured
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3 d-flex align-items-end pb-1">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="add_active"
                          defaultChecked
                          {...rAdd("is_active")}
                        />
                        <label
                          className="form-check-label fw-semibold small"
                          htmlFor="add_active"
                        >
                          Active
                        </label>
                      </div>
                    </div>

                    {/* Images */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        Product Images <span className="text-danger">*</span>{" "}
                        <span className="text-muted fw-normal">
                          (Minimum 4)
                        </span>
                      </label>
                      <div
                        className="p-3 rounded-3"
                        style={{
                          border: "2px dashed #c4b5fd",
                          background: "#f8f5ff",
                        }}
                      >
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="form-control mb-2"
                          onChange={onAddImageChange}
                        />
                        {addPreviews.length > 0 && (
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            {addPreviews.map((src, i) => (
                              <div key={i} style={{ width: 90 }}>
                                <img
                                  src={src}
                                  alt=""
                                  style={{
                                    width: 90,
                                    height: 90,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    border: "2px solid #dee2e6",
                                  }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm w-100 mt-1 py-0"
                                  style={{ fontSize: 11 }}
                                  onClick={() => removeAddPreview(i)}
                                >
                                  <i className="bi bi-trash"></i> Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {addImages.length > 0 && addImages.length < 4 && (
                          <div className="alert alert-warning mt-2 py-1 mb-0 small">
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            {4 - addImages.length} more image(s) needed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div
                className="modal-footer px-4 py-3 border-top"
                style={{ background: "#fff" }}
              >
                <button
                  type="button"
                  className="btn btn-light px-4"
                  onClick={() => {
                    setShowAdd(false);
                    resetAdd();
                    setAddImages([]);
                    setAddPreviews([]);
                    setAddWeights([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="addProductForm"
                  className="btn px-5"
                  disabled={addingProduct}
                  style={{
                    background: "linear-gradient(135deg,#11998e,#38ef7d)",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                  }}
                >
                  {addingProduct ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i>Add Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          EDIT PRODUCT MODAL
      ════════════════════════════════════════════════════════════════════ */}
      {showEdit && editProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 1050,
            overflowY: "auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "30px 12px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEdit(false);
          }}
        >
          <div
            style={{ width: "100%", maxWidth: 900 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content rounded-4 shadow-lg border-0"
              style={{ background: "#fff" }}
            >
              <div
                className="modal-header text-white px-4 py-3"
                style={{
                  background: "linear-gradient(135deg,#667eea,#764ba2)",
                  borderRadius: "16px 16px 0 0",
                }}
              >
                <div>
                  <h5 className="modal-title fw-bold mb-0">
                    <i className="bi bi-pencil-square me-2"></i>Edit Product
                  </h5>
                  <small style={{ opacity: 0.85 }}>
                    ID: {editProduct.id} · {editProduct.product_name}
                  </small>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEdit(false)}
                />
              </div>

              <div className="modal-body p-4" style={{ background: "#fff" }}>
                {/* ── Image Management Section ──────────────────────────── */}
                <div
                  className="mb-4 p-3 rounded-3"
                  style={{
                    background: "#f5f3ff",
                    border: "1.5px solid #c4b5fd",
                  }}
                >
                  <h6 className="fw-bold mb-3" style={{ color: "#667eea" }}>
                    <i className="bi bi-images me-2"></i>Product Images
                  </h6>

                  {/* Current images with Replace button */}
                  {parseImages(editProduct.product_images).length > 0 && (
                    <div className="mb-3">
                      <p className="small text-muted fw-semibold mb-2">
                        Current Images — Click Replace to swap one:
                      </p>
                      <div className="d-flex flex-wrap gap-3">
                        {parseImages(editProduct.product_images).map(
                          (img, imgIdx) => (
                            <div key={imgIdx} style={{ width: 100 }}>
                              <img
                                src={img}
                                alt=""
                                style={{
                                  width: 100,
                                  height: 100,
                                  objectFit: "cover",
                                  borderRadius: 10,
                                  border: "2px solid #dee2e6",
                                }}
                              />
                              <label
                                htmlFor={`replace-img-${imgIdx}`}
                                className="btn btn-sm btn-outline-danger w-100 mt-1 py-0"
                                style={{ fontSize: 11, cursor: "pointer" }}
                              >
                                <i className="bi bi-arrow-repeat me-1"></i>
                                Replace
                              </label>
                              <input
                                id={`replace-img-${imgIdx}`}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                disabled={imgUploading}
                                onChange={(e) =>
                                  handleReplaceImage(imgIdx, e.target.files[0])
                                }
                              />
                            </div>
                          ),
                        )}
                      </div>
                      {imgUploading && (
                        <div className="text-center mt-2">
                          <span className="spinner-border spinner-border-sm text-primary me-2" />
                          <small className="text-muted">Uploading...</small>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add more images */}
                  <div
                    className="p-3 rounded-3"
                    style={{ border: "2px dashed #c4b5fd", background: "#fff" }}
                  >
                    <p className="small text-muted fw-semibold mb-2">
                      <i className="bi bi-cloud-upload me-1"></i>Add More Images
                      (POST /add-images):
                    </p>
                    <div className="d-flex gap-2 align-items-end">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="form-control"
                        onChange={onMoreImagesChange}
                        disabled={imgUploading}
                      />
                      <button
                        type="button"
                        className="btn btn-sm px-3 text-nowrap"
                        style={{
                          background: "linear-gradient(135deg,#667eea,#764ba2)",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          height: 38,
                        }}
                        onClick={handleAddMoreImages}
                        disabled={!moreImages.length || imgUploading}
                      >
                        {imgUploading ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <>
                            <i className="bi bi-upload me-1"></i>Upload
                          </>
                        )}
                      </button>
                    </div>
                    {morePreviews.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {morePreviews.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt=""
                            style={{
                              width: 70,
                              height: 70,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "2px solid #dee2e6",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Product Details Form ──────────────────────────────── */}
                <form id="editProductForm" onSubmit={hsEdit(onEditProduct)}>
                  <div className="row g-3">
                    {/* Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">
                        Product Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${eEdit.product_name ? "is-invalid" : ""}`}
                        {...rEdit("product_name", { required: "Required" })}
                      />
                      {eEdit.product_name && (
                        <div className="invalid-feedback">
                          {eEdit.product_name.message}
                        </div>
                      )}
                    </div>

                    {/* Category */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${eEdit.category_name ? "is-invalid" : ""}`}
                        {...rEdit("category_name", { required: "Required" })}
                        onChange={(e) => {
                          const selected = categories.find(
                            (c) =>
                              (c.name || c.category_name) === e.target.value,
                          );
                          setEditValue("category_name", e.target.value);
                          setEditValue(
                            "category_id",
                            selected?.id || selected?.category_id || "",
                          );
                        }}
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat, ci) => (
                          <option
                            key={cat.id || cat.category_id || ci}
                            value={cat.name || cat.category_name}
                          >
                            {cat.name || cat.category_name}
                          </option>
                        ))}
                      </select>
                      {eEdit.category_name && (
                        <div className="invalid-feedback">
                          {eEdit.category_name.message}
                        </div>
                      )}
                    </div>

                    {/* Weight Tags */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        Weight Variants <span className="text-danger">*</span>{" "}
                        <span className="text-muted fw-normal">
                          (press Enter or + to add)
                        </span>
                      </label>
                      <WeightTagInput
                        weights={editWeights}
                        setWeights={setEditWeights}
                      />
                    </div>

                    {/* Purchase Price */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">
                        Purchase Price (₹){" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className={`form-control ${eEdit.product_purchase_price ? "is-invalid" : ""}`}
                          {...rEdit("product_purchase_price", {
                            required: "Required",
                            min: { value: 0, message: "≥ 0" },
                          })}
                        />
                        {eEdit.product_purchase_price && (
                          <div className="invalid-feedback">
                            {eEdit.product_purchase_price.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selling Price */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">
                        Selling Price (₹) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className={`form-control ${eEdit.product_price ? "is-invalid" : ""}`}
                          {...rEdit("product_price", {
                            required: "Required",
                            min: { value: 0, message: "≥ 0" },
                          })}
                        />
                        {eEdit.product_price && (
                          <div className="invalid-feedback">
                            {eEdit.product_price.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* MRP */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">
                        MRP (₹) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className={`form-control ${eEdit.product_del_price ? "is-invalid" : ""}`}
                          {...rEdit("product_del_price", {
                            required: "Required",
                            min: { value: 0, message: "≥ 0" },
                          })}
                        />
                        {eEdit.product_del_price && (
                          <div className="invalid-feedback">
                            {eEdit.product_del_price.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stock */}
                    <div className="col-md-3">
                      <label className="form-label fw-semibold small">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        {...rEdit("product_stock", {
                          min: { value: 0, message: "≥ 0" },
                        })}
                      />
                    </div>

                    {/* Toggles */}
                    <div className="col-md-3 d-flex align-items-end pb-1">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="edit_featured"
                          {...rEdit("is_featured")}
                        />
                        <label
                          className="form-check-label fw-semibold small"
                          htmlFor="edit_featured"
                        >
                          Featured
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3 d-flex align-items-end pb-1">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="edit_active"
                          {...rEdit("is_active")}
                        />
                        <label
                          className="form-check-label fw-semibold small"
                          htmlFor="edit_active"
                        >
                          Active
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div
                className="modal-footer px-4 py-3 border-top"
                style={{ background: "#fff" }}
              >
                <button
                  type="button"
                  className="btn btn-light px-4"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="editProductForm"
                  className="btn px-5"
                  disabled={updatingProduct}
                  style={{
                    background: "linear-gradient(135deg,#667eea,#764ba2)",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                  }}
                >
                  {updatingProduct ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ════════════════════════════════════════════════════════════════════ */}
      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 1060,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 12px",
          }}
          onClick={() => {
            if (!deleting) setDeleteTarget(null);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div
              style={{
                background: "linear-gradient(135deg,#ff416c,#ff4b2b)",
                padding: "20px 24px",
              }}
            >
              <h5 className="mb-0 fw-bold text-white">
                <i className="bi bi-exclamation-triangle me-2"></i>Delete
                Product
              </h5>
            </div>
            {/* body */}
            <div className="p-4 text-center">
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: "#fff0f0",
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="bi bi-trash3"
                  style={{ fontSize: 28, color: "#ff416c" }}
                ></i>
              </div>
              <p
                className="fw-semibold text-dark mb-1"
                style={{ fontSize: 16 }}
              >
                Are you sure you want to delete?
              </p>
              <p className="text-muted mb-0">
                <span className="fw-bold text-dark">
                  "{deleteTarget.product_name}"
                </span>
                <br />
                <small>This action cannot be undone.</small>
              </p>
            </div>
            {/* footer */}
            <div className="px-4 pb-4 d-flex gap-3 justify-content-center">
              <button
                className="btn btn-light px-4 fw-semibold"
                style={{ borderRadius: 8, minWidth: 110 }}
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn px-4 fw-semibold text-white"
                style={{
                  background: "linear-gradient(135deg,#ff416c,#ff4b2b)",
                  border: "none",
                  borderRadius: 8,
                  minWidth: 140,
                }}
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash3 me-2"></i>Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          CATEGORY MANAGEMENT MODAL (Full CRUD)
      ════════════════════════════════════════════════════════════════════ */}
      {showCatModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 1070,
            overflowY: "auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "30px 12px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCatModal(false);
              setEditCat(null);
              setCatForm({ name: "", description: "" });
              setDeleteCatTarget(null);
            }
          }}
        >
          <div
            style={{ width: "100%", maxWidth: 700 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content rounded-4 shadow-lg border-0"
              style={{ background: "#fff" }}
            >
              {/* Header */}
              <div
                className="modal-header text-white px-4 py-3"
                style={{
                  background: "linear-gradient(135deg,#f7971e,#ffd200)",
                  borderRadius: "16px 16px 0 0",
                }}
              >
                <h5
                  className="modal-title fw-bold mb-0"
                  style={{ color: "#333" }}
                >
                  <i className="bi bi-tags me-2"></i>Manage Categories
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCatModal(false);
                    setEditCat(null);
                    setCatForm({
                      category_name: "",
                      category_description: "",
                      is_featured: false,
                      is_active: true,
                    });
                    setDeleteCatTarget(null);
                  }}
                />
              </div>

              <div className="modal-body p-4" style={{ background: "#fff" }}>
                {/* ── Add / Edit Form ── */}
                <div
                  className="p-3 rounded-3 mb-4"
                  style={{
                    background: editCat ? "#fff8f0" : "#f0fff8",
                    border: `1.5px solid ${editCat ? "#ffd200" : "#38ef7d"}`,
                  }}
                >
                  <h6
                    className="fw-bold mb-3"
                    style={{ color: editCat ? "#c87800" : "#11998e" }}
                  >
                    <i
                      className={`bi ${editCat ? "bi-pencil-square" : "bi-plus-circle"} me-2`}
                    ></i>
                    {editCat ? "Edit Category" : "Add New Category"}
                  </h6>
                  <div className="row g-2">
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Category Name *"
                        value={catForm.category_name}
                        onChange={(e) =>
                          setCatForm((p) => ({
                            ...p,
                            category_name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Description (optional)"
                        value={catForm.category_description}
                        onChange={(e) =>
                          setCatForm((p) => ({
                            ...p,
                            category_description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-center gap-3">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="cat_featured"
                          checked={catForm.is_featured}
                          onChange={(e) =>
                            setCatForm((p) => ({
                              ...p,
                              is_featured: e.target.checked,
                            }))
                          }
                        />
                        <label
                          className="form-check-label small"
                          htmlFor="cat_featured"
                        >
                          Featured
                        </label>
                      </div>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="cat_active"
                          checked={catForm.is_active}
                          onChange={(e) =>
                            setCatForm((p) => ({
                              ...p,
                              is_active: e.target.checked,
                            }))
                          }
                        />
                        <label
                          className="form-check-label small"
                          htmlFor="cat_active"
                        >
                          Active
                        </label>
                      </div>
                    </div>
                    <div className="col-12 d-flex gap-2 mt-1">
                      <button
                        type="button"
                        className="btn fw-semibold px-4"
                        style={{
                          background: editCat
                            ? "linear-gradient(135deg,#f7971e,#ffd200)"
                            : "linear-gradient(135deg,#11998e,#38ef7d)",
                          color: editCat ? "#333" : "#fff",
                          border: "none",
                          borderRadius: 8,
                        }}
                        disabled={catSubmitting}
                        onClick={
                          editCat ? handleUpdateCategory : handleAddCategory
                        }
                      >
                        {catSubmitting ? (
                          <span className="spinner-border spinner-border-sm me-2" />
                        ) : null}
                        {editCat ? (
                          <>
                            <i className="bi bi-check-circle me-1"></i>Update
                            Category
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-lg me-1"></i>Add Category
                          </>
                        )}
                      </button>
                      {editCat && (
                        <button
                          type="button"
                          className="btn btn-light px-4"
                          style={{ borderRadius: 8 }}
                          onClick={() => {
                            setEditCat(null);
                            setCatForm({
                              category_name: "",
                              category_description: "",
                              is_featured: false,
                              is_active: true,
                            });
                          }}
                        >
                          <i className="bi bi-x me-1"></i>Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete Confirm Sub-section */}
                {deleteCatTarget && (
                  <div
                    className="alert d-flex align-items-center justify-content-between gap-3 mb-3 p-3 rounded-3"
                    style={{
                      background: "#fff0f0",
                      border: "1.5px solid #ff416c",
                    }}
                  >
                    <span className="fw-semibold" style={{ color: "#c0392b" }}>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Delete &quot;
                      {deleteCatTarget.name || deleteCatTarget.category_name}
                      &quot;? This cannot be undone!
                    </span>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-light px-3"
                        onClick={() => setDeleteCatTarget(null)}
                        disabled={deletingCat}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-sm px-3 text-white"
                        style={{
                          background: "linear-gradient(135deg,#ff416c,#ff4b2b)",
                          border: "none",
                          borderRadius: 6,
                        }}
                        onClick={handleDeleteCategory}
                        disabled={deletingCat}
                      >
                        {deletingCat ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <>
                            <i className="bi bi-trash3 me-1"></i>Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Category List ── */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0" style={{ color: "#555" }}>
                      <i className="bi bi-list-ul me-2"></i>All Categories
                    </h6>
                    <small className="text-muted">
                      {categories.length} total
                    </small>
                  </div>

                  {catLoading ? (
                    <div className="text-center py-4">
                      <span className="spinner-border text-warning" />
                      <p className="text-muted mt-2 mb-0 small">
                        Loading categories...
                      </p>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-center py-4">
                      <i
                        className="bi bi-folder2-open"
                        style={{ fontSize: "2rem", color: "#ccc" }}
                      ></i>
                      <p className="text-muted mt-2 mb-0 small">
                        No categories yet. Add one above.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="rounded-3 overflow-hidden"
                      style={{
                        border: "1px solid #eee",
                        maxHeight: 320,
                        overflowY: "auto",
                      }}
                    >
                      <table className="table table-hover align-middle mb-0">
                        <thead
                          style={{
                            background: "#fafafa",
                            position: "sticky",
                            top: 0,
                          }}
                        >
                          <tr>
                            <th className="py-2 ps-3 small text-muted">#</th>
                            <th className="py-2 small text-muted">Name</th>
                            <th className="py-2 small text-muted">
                              Description
                            </th>
                            <th className="py-2 pe-3 small text-muted text-end">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((cat, ci) => (
                            <tr
                              key={cat.id || cat.category_id || ci}
                              style={{ borderBottom: "1px solid #f5f5f5" }}
                            >
                              <td className="ps-3 text-muted small">
                                {ci + 1}
                              </td>
                              <td>
                                <span
                                  className="badge rounded-pill px-3 py-2"
                                  style={{
                                    background: "#ede7f6",
                                    color: "#6c3dbf",
                                    fontWeight: 600,
                                    fontSize: 13,
                                  }}
                                >
                                  {cat.name || cat.category_name}
                                </span>
                              </td>
                              <td className="small text-muted">
                                {cat.category_description ||
                                  cat.description ||
                                  "—"}
                              </td>
                              <td className="pe-3 text-end">
                                <div className="d-flex gap-2 justify-content-end">
                                  <button
                                    className="btn btn-sm px-3"
                                    style={{
                                      background:
                                        "linear-gradient(135deg,#667eea,#764ba2)",
                                      color: "white",
                                      border: "none",
                                      borderRadius: 6,
                                    }}
                                    onClick={() => {
                                      setEditCat(cat);
                                      setCatForm({
                                        category_name:
                                          cat.category_name || cat.name || "",
                                        category_description:
                                          cat.category_description ||
                                          cat.description ||
                                          "",
                                        is_featured: !!cat.is_featured,
                                        is_active:
                                          cat.is_active !== undefined
                                            ? !!cat.is_active
                                            : true,
                                      });
                                      setDeleteCatTarget(null);
                                    }}
                                  >
                                    <i className="bi bi-pencil-square me-1"></i>
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-sm px-3"
                                    style={{
                                      background:
                                        "linear-gradient(135deg,#ff416c,#ff4b2b)",
                                      color: "white",
                                      border: "none",
                                      borderRadius: 6,
                                    }}
                                    onClick={() => {
                                      setDeleteCatTarget(cat);
                                      setEditCat(null);
                                      setCatForm({
                                        category_name: "",
                                        category_description: "",
                                        is_featured: false,
                                        is_active: true,
                                      });
                                    }}
                                  >
                                    <i className="bi bi-trash3 me-1"></i>Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="modal-footer px-4 py-3 border-top"
                style={{ background: "#fff", borderRadius: "0 0 16px 16px" }}
              >
                <button
                  type="button"
                  className="btn btn-light px-4"
                  onClick={() => {
                    setShowCatModal(false);
                    setEditCat(null);
                    setCatForm({
                      category_name: "",
                      category_description: "",
                      is_featured: false,
                      is_active: true,
                    });
                    setDeleteCatTarget(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductInfo;
