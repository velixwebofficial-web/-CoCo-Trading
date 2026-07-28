let allOrders = [];
let activeOrderId = null;

const ordersTableBody = document.getElementById("ordersTableBody");
const orderModal = document.getElementById("orderModal");

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
}

function formatMoney(n) {
    return `${Number(n || 0).toFixed(2)} JD`;
}

function formatDate(iso) {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function statusClass(status) {
    switch (status) {
        case "completed": return "completed";
        case "shipping": return "shipping";
        case "pending": return "pending";
        case "processing": return "shipping";
        case "cancelled": return "pending";
        default: return "pending";
    }
}

async function loadOrders() {
    try {
        const res = await fetch("/api/admin/orders", { credentials: "include" });
        if (!res.ok) {
            if (res.status === 401) window.location.href = "index.html";
            return;
        }
        allOrders = await res.json();
        renderTable();
    } catch (err) {
        ordersTableBody.innerHTML = `<tr><td colspan="7">Could not load orders. Is the server running?</td></tr>`;
    }
}

function renderTable() {
    const search = (document.getElementById("orderSearch").value || "").toLowerCase();
    const status = document.getElementById("orderStatusFilter").value;

    const filtered = allOrders.filter((o) => {
        if (status && o.status !== status) return false;
        if (search) {
            const haystack = `${o.id} ${o.customer.name}`.toLowerCase();
            if (!haystack.includes(search)) return false;
        }
        return true;
    });

    if (filtered.length === 0) {
        ordersTableBody.innerHTML = `<tr><td colspan="7">No orders yet. Orders placed on the public site will appear here in real time.</td></tr>`;
        return;
    }

    ordersTableBody.innerHTML = filtered
        .map((o) => {
            const itemCount = o.items.reduce((sum, it) => sum + it.qty, 0);
            return `
            <tr>
                <td>#${o.id}</td>
                <td>${escapeHtml(o.customer.name)}</td>
                <td>${formatDate(o.createdAt)}</td>
                <td>${itemCount}</td>
                <td>${formatMoney(o.total)}</td>
                <td><span class="status ${statusClass(o.status)}">${escapeHtml(o.status[0].toUpperCase() + o.status.slice(1))}</span></td>
                <td><button class="edit-btn" data-view-id="${o.id}"><i class="fa-solid fa-eye"></i></button></td>
            </tr>
        `;
        })
        .join("");
}

function openOrderModal(order) {
    activeOrderId = order.id;
    document.getElementById("orderModalId").textContent = `#${order.id}`;
    document.getElementById("orderCustomerName").textContent = order.customer.name || "-";
    document.getElementById("orderCustomerEmail").textContent = order.customer.email || "-";
    document.getElementById("orderCustomerPhone").textContent = order.customer.phone || "-";
    document.getElementById("orderCustomerCountry").textContent = order.customer.country || "-";
    document.getElementById("orderShippingAddress").innerHTML =
        `${escapeHtml(order.customer.address || "")}<br>${escapeHtml(order.customer.city || "")}, ${escapeHtml(order.customer.country || "")}`;
    document.getElementById("orderNotes").textContent = order.customer.notes ? `Notes: ${order.customer.notes}` : "";

    document.getElementById("orderItemsBody").innerHTML = order.items
        .map(
            (it) => `
        <tr>
            <td>${escapeHtml(it.name)}</td>
            <td>${it.qty}</td>
            <td>${formatMoney(it.price)}</td>
            <td>${formatMoney(it.lineTotal)}</td>
        </tr>
    `
        )
        .join("");

    document.getElementById("orderModalTotal").textContent = formatMoney(order.total);
    document.getElementById("orderStatusSelect").value = order.status;

    orderModal.classList.add("active");
}

ordersTableBody.addEventListener("click", (e) => {
    const viewBtn = e.target.closest("[data-view-id]");
    if (!viewBtn) return;
    const order = allOrders.find((o) => String(o.id) === viewBtn.dataset.viewId);
    if (order) openOrderModal(order);
});

document.getElementById("saveOrderStatusBtn").addEventListener("click", async () => {
    if (!activeOrderId) return;
    const status = document.getElementById("orderStatusSelect").value;
    try {
        const res = await fetch(`/api/admin/orders/${activeOrderId}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error("Update failed");
        showToast("Order status updated.", "success");
        orderModal.classList.remove("active");
        await loadOrders();
    } catch (err) {
        showToast("Could not update the order status.", "error");
    }
});

document.getElementById("orderSearch").addEventListener("keyup", renderTable);
document.getElementById("orderStatusFilter").addEventListener("change", renderTable);
document.getElementById("applyOrderFiltersBtn").addEventListener("click", renderTable);

document.getElementById("exportOrdersBtn").addEventListener("click", () => {
    if (allOrders.length === 0) {
        showToast("No orders to export yet.", "error");
        return;
    }
    const rows = [["Order ID", "Customer", "Phone", "Date", "Items", "Total (JD)", "Status"]];
    allOrders.forEach((o) => {
        rows.push([
            o.id,
            o.customer.name,
            o.customer.phone,
            formatDate(o.createdAt),
            o.items.reduce((s, it) => s + it.qty, 0),
            o.total.toFixed(2),
            o.status,
        ]);
    });
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
});

loadOrders();
