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
  if (Array.isArray(val)) {
    return val.map((v) =>
      typeof v === "string"
        ? { weight: v, price: 0, purchase_price: 0, del_price: 0 }
        : v,
    );
  }
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) {
      return parsed.map((v) =>
        typeof v === "string"
          ? { weight: v, price: 0, purchase_price: 0, del_price: 0 }
          : v,
      );
    }
    return [{ weight: String(val), price: 0, purchase_price: 0, del_price: 0 }];
  } catch {
    return [{ weight: String(val), price: 0, purchase_price: 0, del_price: 0 }];
  }
};

/* ── WeightTagInput: dynamic weight chips ─────────────────────────────────── */
const WeightPriceInput = ({ variants, setVariants, onFirstVariant }) => {
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [delPrice, setDelPrice] = useState("");

  const addVariant = () => {
    if (!weight.trim()) return;
    const newVariant = {
      weight: weight.trim(),
      price: Number(price) || 0,
      purchase_price: Number(purchasePrice) || 0,
      del_price: Number(delPrice) || 0,
    };
    const updated = [...variants, newVariant];
    setVariants(updated);

    // If it's the first variant, optionally notify parent to sync main prices
    if (updated.length === 1 && onFirstVariant) {
      onFirstVariant(newVariant);
    }

    setWeight("");
    setPrice("");
    setPurchasePrice("");
    setDelPrice("");
  };

  const removeVariant = (i) =>
    setVariants(variants.filter((_, idx) => idx !== i));

  return (
    <div
      className="p-3 rounded-3"
      style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
    >
      <div className="row g-2 mb-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label small fw-bold mb-1">Weight</label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="e.g. 500gm"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label small fw-bold mb-1">Purchase ₹</label>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="0"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label small fw-bold mb-1">Selling ₹</label>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label small fw-bold mb-1">MRP ₹</label>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="0"
            value={delPrice}
            onChange={(e) => setDelPrice(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button
            type="button"
            className="btn btn-primary btn-sm w-100"
            style={{ height: "31px", fontWeight: 600 }}
            onClick={addVariant}
          >
            Add Variant
          </button>
        </div>
      </div>

      <div className="table-responsive rounded-2 overflow-hidden border">
        <table className="table table-sm table-hover mb-0 align-middle">
          <thead className="table-light">
            <tr style={{ fontSize: "11px", textTransform: "uppercase" }}>
              <th className="ps-3">Weight</th>
              <th>Purchase</th>
              <th>Selling</th>
              <th>MRP</th>
              <th className="text-end pe-3">Action</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "12px" }}>
            {variants.map((v, i) => (
              <tr key={i}>
                <td className="ps-3 fw-bold text-primary">{v.weight}</td>
                <td>₹{v.purchase_price}</td>
                <td className="fw-bold text-success">₹{v.price}</td>
                <td className="text-muted text-decoration-line-through">
                  ₹{v.del_price}
                </td>
                <td className="text-end pe-3">
                  <button
                    type="button"
                    className="btn btn-link link-danger btn-sm p-0"
                    onClick={() => removeVariant(i)}
                  >
                    remove
                  </button>
                </td>
              </tr>
            ))}
            {variants.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-3 text-muted">
                  No variants added. Please add at least one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
      best_saller: false,
      is_active: true,
      short_description: "",
      full_description: "",
      health_benefits: "",
      ingredients: "",
      product_subtitle: "",
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
    fetchProducts(1, searchTerm, selectedCategory);
    fetchCategories();
  }, []);

  // Fetch when category or page changes
  useEffect(() => {
    fetchProducts(currentPage, searchTerm, selectedCategory);
  }, [selectedCategory, currentPage]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) fetchProducts(1, searchTerm, selectedCategory);
      else setCurrentPage(1); // Changing search resets to page 1
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = async (page = 1, search = "", cat = "") => {
    setLoading(true);
    try {
      let url = "products/get_all_products";
      const params = [];
      params.push(`page=${page}`);
      params.push(`limit=${limit}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (cat) params.push(`category=${encodeURIComponent(cat)}`);

      if (params.length > 0) url += `?${params.join("&")}`;

      const res = await getData(url);
      if (res?.success) {
        setProducts(res.products || []);
        if (res.pagination) {
          setTotalItems(res.pagination.totalItems);
          setTotalPages(res.pagination.totalPages);
          // Only update if different to avoid infinite loop
          if (res.pagination.currentPage !== currentPage) {
            // No direct update here to avoid effect triggering twice
          }
        }
      }
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
      best_saller: !!p.best_saller,
      is_active: !!p.is_active,
      short_description: p.short_description || "",
      full_description: p.full_description || "",
      health_benefits: p.health_benefits || "",
      ingredients: p.ingredients || "",
      product_subtitle: p.product_subtitle || "",
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
    if (addImages.length === 0) {
      toastError("Please add at least one image.");
      return;
    }

    if (addWeights.length === 0) {
      toastError("Add at least one weight variant.");
      return;
    }
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === "is_featured" || k === "is_active" || k === "best_saller")
          fd.append(k, v ? 1 : 0);
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
        best_saller: data.best_saller ? 1 : 0,
        is_active: data.is_active ? 1 : 0,
        short_description: data.short_description,
        full_description: data.full_description,
        health_benefits: data.health_benefits,
        ingredients: data.ingredients,
        product_subtitle: data.product_subtitle,
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
            {/* Dashboard Header */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
              <div>
                <h3 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                  Product Inventory
                </h3>
                <p className="text-muted small mb-0">
                  Manage your store products, pricing, and stock levels
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn shadow-sm d-flex align-items-center gap-2"
                  style={{
                    borderRadius: 12,
                    padding: "10px 20px",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                  onClick={() => setShowCatModal(true)}
                >
                  <i className="bi bi-grid-3x3-gap"></i>
                  <span>Manage Categories</span>
                </button>
                <button
                  className="btn btn-primary d-flex align-items-center gap-2 shadow-sm border-0"
                  style={{
                    borderRadius: 12,
                    padding: "10px 24px",
                    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                  onClick={() => setShowAdd(true)}
                >
                  <i className="bi bi-plus-lg"></i>
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Dashboard Controls: Search & Category Filter */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-8 col-lg-6">
                <div role="search" className="position-relative">
                  <i
                    className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                    style={{ zIndex: 5 }}
                  ></i>
                  <input
                    type="text"
                    className="form-control ps-5 border shadow-sm"
                    placeholder="Search by product name..."
                    style={{
                      height: 48,
                      borderRadius: 12,
                      borderColor: "#e2e8f0",
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-4 col-lg-3">
                <select
                  className="form-select border shadow-sm"
                  style={{
                    borderRadius: 12,
                    height: 48,
                    borderColor: "#e2e8f0",
                  }}
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c.category_name || c.name}>
                      {c.category_name || c.name}
                    </option>
                  ))}
                </select>
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
                <>
                  <div
                    className="table-responsive"
                    style={{ minHeight: "auto" }}
                  >
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
                              <div className="d-flex flex-column gap-1">
                                {parseWeight(p.product_weight).map((w, wi) => (
                                  <div
                                    key={wi}
                                    className="d-flex justify-content-between align-items-center"
                                    style={{
                                      background: "#f8fafc",
                                      color: "#475569",
                                      fontSize: "11px",
                                      fontWeight: 500,
                                      padding: "2px 8px",
                                      borderRadius: "4px",
                                      border: "1px solid #e2e8f0",
                                      minWidth: "120px",
                                    }}
                                  >
                                    <span className="fw-bold">{w.weight}</span>
                                    <span className="ms-2 text-success">
                                      ₹{w.price}
                                    </span>
                                  </div>
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

                  {/* Pagination Info & Controls */}
                  <div
                    className="px-4 py-3 d-flex flex-wrap align-items-center justify-content-between border-top"
                    style={{ background: "#f8fafc" }}
                  >
                    <div className="text-muted small mb-2 mb-sm-0">
                      Showing{" "}
                      <b>
                        {(currentPage - 1) * limit + 1} -{" "}
                        {Math.min(currentPage * limit, totalItems)}
                      </b>{" "}
                      of <b>{totalItems}</b> products
                    </div>

                    {totalPages > 1 && (
                      <nav aria-label="Page navigation">
                        <ul className="pagination pagination-sm mb-0 gap-1">
                          <li
                            className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                          >
                            <button
                              className="page-link border-0 shadow-sm rounded-3"
                              onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                              }
                              style={{
                                width: 36,
                                height: 36,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <i className="bi bi-chevron-left"></i>
                            </button>
                          </li>

                          {[...Array(totalPages)].map((_, i) => {
                            const pg = i + 1;
                            if (
                              totalPages > 7 &&
                              pg !== 1 &&
                              pg !== totalPages &&
                              Math.abs(pg - currentPage) > 1
                            ) {
                              if (pg === 2 || pg === totalPages - 1)
                                return (
                                  <li key={pg} className="page-item disabled">
                                    <span className="page-link border-0 bg-transparent">
                                      ...
                                    </span>
                                  </li>
                                );
                              return null;
                            }

                            return (
                              <li
                                key={pg}
                                className={`page-item ${currentPage === pg ? "active" : ""}`}
                              >
                                <button
                                  className="page-link border-0 shadow-sm rounded-3 mx-1"
                                  onClick={() => setCurrentPage(pg)}
                                  style={{
                                    width: 36,
                                    height: 36,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background:
                                      currentPage === pg ? "#6366f1" : "#fff",
                                    color:
                                      currentPage === pg ? "#fff" : "#1e293b",
                                    fontWeight: 600,
                                  }}
                                >
                                  {pg}
                                </button>
                              </li>
                            );
                          })}

                          <li
                            className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                          >
                            <button
                              className="page-link border-0 shadow-sm rounded-3"
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(totalPages, p + 1),
                                )
                              }
                              style={{
                                width: 36,
                                height: 36,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <i className="bi bi-chevron-right"></i>
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </div>
                </>
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

                    {/* Weight Variants */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        Weight/Price Variants{" "}
                        <span className="text-danger">*</span>{" "}
                        <span className="text-muted fw-normal">
                          Add multiple weights each with their own price
                        </span>
                      </label>
                      <WeightPriceInput
                        variants={addWeights}
                        setVariants={setAddWeights}
                        onFirstVariant={(v) => {
                          // Automatically fill main price fields for the first variant
                          setAddValue("product_price", v.price);
                          setAddValue(
                            "product_purchase_price",
                            v.purchase_price,
                          );
                          setAddValue("product_del_price", v.del_price);
                        }}
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
                      <div
                        className="form-check form-switch p-0"
                        style={{ paddingLeft: "2.5em !important" }}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="add_best_saller"
                          {...rAdd("best_saller")}
                        />
                        <label
                          className="form-check-label fw-semibold small ms-2"
                          htmlFor="add_best_saller"
                        >
                          Best Seller
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

                    {/* Descriptions */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        Product Subtitle
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Naturally grown, protein-rich organic toor dal..."
                        {...rAdd("product_subtitle")}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        Short Description
                      </label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Brief overview of the product..."
                        {...rAdd("short_description")}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        Full Description
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Detailed product information..."
                        {...rAdd("full_description")}
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">
                        Health Benefits
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Enter benefits (one per line)..."
                        {...rAdd("health_benefits")}
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">
                        Ingredients
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="List ingredients..."
                        {...rAdd("ingredients")}
                      ></textarea>
                    </div>

                    {/* Images */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        Product Images <span className="text-danger">*</span>{" "}
                        <span className="text-muted fw-normal">
                          (At least 1)
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
                              <div key={i} style={{ width: 100 }}>
                                <img
                                  src={src}
                                  className="img-thumbnail"
                                  style={{
                                    width: "100%",
                                    height: 120,
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }}
                                  alt={`Product thumbnail ${i + 1}`}
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
                        {addImages.length === 0 && (
                          <div className="alert alert-warning mt-2 py-1 mb-0 small">
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            Please add at least one image.
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
                                className="img-thumbnail"
                                style={{
                                  width: "100%",
                                  height: 120,
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                                alt={`Product thumbnail ${imgIdx + 1}`}
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

                    {/* Weight Variants */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        Weight/Price Variants{" "}
                        <span className="text-danger">*</span>{" "}
                        <span className="text-muted fw-normal">
                          Manage individual prices for different weights
                        </span>
                      </label>
                      <WeightPriceInput
                        variants={editWeights}
                        setVariants={setEditWeights}
                        onFirstVariant={(v) => {
                          // Sync main fields if they might be empty
                          setEditValue("product_price", v.price);
                          setEditValue(
                            "product_purchase_price",
                            v.purchase_price,
                          );
                          setEditValue("product_del_price", v.del_price);
                        }}
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
                          id="edit_best_saller"
                          {...rEdit("best_saller")}
                        />
                        <label
                          className="form-check-label fw-semibold small"
                          htmlFor="edit_best_saller"
                        >
                          Best Seller
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

                    {/* Descriptions */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        Product Subtitle
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Subtitle..."
                        {...rEdit("product_subtitle")}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        Short Description
                      </label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Brief overview..."
                        {...rEdit("short_description")}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        Full Description
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Detailed info..."
                        {...rEdit("full_description")}
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">
                        Health Benefits
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Benefits..."
                        {...rEdit("health_benefits")}
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">
                        Ingredients
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Ingredients..."
                        {...rEdit("ingredients")}
                      ></textarea>
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
              setCatForm({
                category_name: "",
                category_description: "",
                is_featured: false,
                is_active: true,
              });
              setDeleteCatTarget(null);
            }
          }}
        >
          <div
            style={{ width: "100%", maxWidth: 1200 }}
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
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0" style={{ color: "#334155" }}>
                      <i className="bi bi-list-ul me-2 text-primary"></i>All
                      Categories
                    </h6>
                    <div className="d-flex align-items-center gap-3">
                      <span className="badge bg-light text-dark border px-3 py-2 rounded-pill small">
                        {categories.length} Total
                      </span>
                    </div>
                  </div>

                  {catLoading ? (
                    <div className="text-center py-5 bg-light rounded-3">
                      <span className="spinner-border text-primary" />
                      <p className="text-muted mt-2 mb-0 small fw-medium">
                        Loading categories...
                      </p>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-center py-5 bg-light rounded-3 border border-dashed">
                      <i
                        className="bi bi-folder2-open d-block mb-2"
                        style={{ fontSize: "2.5rem", color: "#cbd5e1" }}
                      ></i>
                      <p className="text-muted mb-0 small">
                        No categories found. Start by adding one above.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="rounded-3 border"
                      style={{
                        background: "#fff",
                        maxHeight: 500,
                        overflowY: "auto",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
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
                            <th className="py-2 small text-muted text-center">
                              Featured
                            </th>
                            <th className="py-2 small text-muted text-center">
                              Active
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
                              <td
                                className="small text-muted"
                                style={{
                                  maxWidth: "180px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {cat.category_description ||
                                  cat.description ||
                                  "—"}
                              </td>
                              <td className="text-center">
                                {cat.is_featured == 1 ||
                                cat.is_featured === true ? (
                                  <span
                                    className="badge bg-warning-subtle text-warning border px-2 py-1 rounded-pill"
                                    style={{ fontSize: "10px" }}
                                  >
                                    Yes
                                  </span>
                                ) : (
                                  <span
                                    className="badge bg-light text-muted border px-2 py-1 rounded-pill"
                                    style={{ fontSize: "10px" }}
                                  >
                                    No
                                  </span>
                                )}
                              </td>
                              <td className="text-center">
                                {cat.is_active == 1 ||
                                cat.is_active === true ? (
                                  <span
                                    className="badge bg-success-subtle text-success border px-2 py-1 rounded-pill"
                                    style={{ fontSize: "10px" }}
                                  >
                                    Yes
                                  </span>
                                ) : (
                                  <span
                                    className="badge bg-danger-subtle text-danger border px-2 py-1 rounded-pill"
                                    style={{ fontSize: "10px" }}
                                  >
                                    No
                                  </span>
                                )}
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
                                        is_featured:
                                          cat.is_featured == 1 ||
                                          cat.is_featured === true,
                                        is_active:
                                          cat.is_active == 1 ||
                                          cat.is_active === true,
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
