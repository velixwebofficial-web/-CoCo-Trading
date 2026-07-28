const CATEGORY_NAMES = {
    "mens-underwear": "Men's Underwear",
    "womens-underwear": "Women's Underwear",
    "womens-socks": "Women's Socks",
    "mens-socks": "Men's Socks",
    "bras": "Bras",
    "boys-socks": "Boys' Socks",
    "girls-socks": "Girls' Socks",
};

let allProducts = [];

const tableBody = document.getElementById("productsTableBody");
const modal = document.getElementById("addProductModal");
const modalTitle = document.getElementById("productModalTitle");
const form = document.getElementById("productForm");

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
}

async function loadProducts() {
    try {
        const res = await fetch("/api/admin/products", { credentials: "include" });
        if (!res.ok) {
            if (res.status === 401) window.location.href = "index.html";
            return;
        }
        allProducts = await res.json();
        renderTable();
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="8">Could not load products. Is the server running?</td></tr>`;
    }
}

function renderTable() {
    const search = (document.getElementById("filterSearch").value || "").toLowerCase();
    const category = document.getElementById("filterCategory").value;
    const status = document.getElementById("filterStatus").value;

    const filtered = allProducts.filter((p) => {
        if (category && p.category !== category) return false;
        if (status && p.status !== status) return false;
        if (search && !p.name.toLowerCase().includes(search)) return false;
        return true;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8">No products found. Click "Add Product" to create one.</td></tr>`;
        return;
    }

    tableBody.innerHTML = filtered
        .map((p) => `
            <tr>
                <td>#${p.id}</td>
                <td><img src="../${p.image}" width="60" alt="${escapeHtml(p.name)}" onerror="this.src='../assets/optimized/categories/${p.category}.webp'"></td>
                <td>${escapeHtml(p.name)}</td>
                <td>${CATEGORY_NAMES[p.category] || p.category}</td>
                <td>${typeof p.price === "number" ? p.price.toFixed(2) + " JD" : "-"}</td>
                <td>${p.stock === null || p.stock === undefined ? "Unlimited" : p.stock}</td>
                <td><span class="status ${p.status === "active" ? "completed" : "shipping"}">${p.status === "active" ? "Active" : "Inactive"}</span></td>
                <td>
                    <button class="edit-btn" data-edit-id="${p.id}"><i class="fa-solid fa-pen"></i></button>
                    <button class="delete-btn" data-delete-id="${p.id}"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `)
        .join("");
}

function openModal(mode, product) {
    form.reset();
    document.getElementById("productId").value = "";
    modalTitle.textContent = mode === "edit" ? "Edit Product" : "Add Product";

    if (mode === "edit" && product) {
        document.getElementById("productId").value = product.id;
        document.getElementById("productName").value = product.name;
        document.getElementById("productCategory").value = product.category;
        document.getElementById("productDescription").value = product.description || "";
        document.getElementById("productPrice").value = typeof product.price === "number" ? product.price : "";
        document.getElementById("productStock").value = product.stock === null || product.stock === undefined ? "" : product.stock;
        document.getElementById("productMoq").value = product.moq || "";
        document.getElementById("productLeadTime").value = product.leadTime || "";
        document.getElementById("productPackaging").value = product.packaging || "";
        document.getElementById("productShipping").value = product.shipping || "";
        document.getElementById("productStatus").value = product.status || "active";
    }

    modal.classList.add("active");
}

document.getElementById("openAddModal").addEventListener("click", () => openModal("add"));

tableBody.addEventListener("click", (e) => {
    const editBtn = e.target.closest("[data-edit-id]");
    const deleteBtn = e.target.closest("[data-delete-id]");

    if (editBtn) {
        const product = allProducts.find((p) => String(p.id) === editBtn.dataset.editId);
        if (product) openModal("edit", product);
    }

    if (deleteBtn) {
        document.getElementById("confirmDeleteBtn").dataset.deleteId = deleteBtn.dataset.deleteId;
        document.getElementById("deleteModal").classList.add("active");
    }
});

document.getElementById("confirmDeleteBtn").addEventListener("click", async (e) => {
    const id = e.currentTarget.dataset.deleteId;
    if (!id) return;

    try {
        const res = await fetch(`/api/admin/products/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Delete failed");
        showToast("Product deleted.", "success");
        document.getElementById("deleteModal").classList.remove("active");
        await loadProducts();
    } catch (err) {
        showToast("Could not delete the product.", "error");
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("productId").value;
    const formData = new FormData();
    formData.append("name", document.getElementById("productName").value.trim());
    formData.append("category", document.getElementById("productCategory").value);
    formData.append("description", document.getElementById("productDescription").value.trim());
    formData.append("price", document.getElementById("productPrice").value.trim());
    formData.append("stock", document.getElementById("productStock").value.trim());
    formData.append("moq", document.getElementById("productMoq").value.trim());
    formData.append("leadTime", document.getElementById("productLeadTime").value.trim());
    formData.append("packaging", document.getElementById("productPackaging").value.trim());
    formData.append("shipping", document.getElementById("productShipping").value.trim());
    formData.append("status", document.getElementById("productStatus").value);

    const imageFile = document.getElementById("productImage").files[0];
    if (imageFile) formData.append("image", imageFile);

    const url = id ? `/api/admin/products/${id}` : "/api/admin/products";
    const method = id ? "PUT" : "POST";

    try {
        const res = await fetch(url, { method, credentials: "include", body: formData });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Save failed");
        }
        showToast(id ? "Product updated." : "Product added.", "success");
        modal.classList.remove("active");
        await loadProducts();
    } catch (err) {
        showToast(err.message || "Could not save the product.", "error");
    }
});

document.getElementById("filterSearch").addEventListener("keyup", renderTable);
document.getElementById("filterCategory").addEventListener("change", renderTable);
document.getElementById("filterStatus").addEventListener("change", renderTable);
document.getElementById("applyFiltersBtn").addEventListener("click", renderTable);

const topSearch = document.getElementById("productSearch");
if (topSearch) {
    topSearch.addEventListener("keyup", () => {
        document.getElementById("filterSearch").value = topSearch.value;
        renderTable();
    });
}

loadProducts();
