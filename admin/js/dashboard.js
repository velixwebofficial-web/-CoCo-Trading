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
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function statusClass(status) {
    switch (status) {
        case "completed": return "completed";
        case "shipping": return "shipping";
        case "processing": return "shipping";
        default: return "pending";
    }
}

async function loadDashboard() {
    try {
        const res = await fetch("/api/admin/stats", { credentials: "include" });
        if (!res.ok) {
            if (res.status === 401) window.location.href = "index.html";
            return;
        }
        const stats = await res.json();

        document.getElementById("statTotalProducts").textContent = stats.totalProducts;
        document.getElementById("statTotalOrders").textContent = stats.totalOrders;
        document.getElementById("statTotalCustomers").textContent = stats.totalCustomers;
        document.getElementById("statTotalRevenue").textContent = formatMoney(stats.totalRevenue);
        document.getElementById("revenueHeadline").textContent = formatMoney(stats.totalRevenue);
        document.getElementById("statPendingOrders").textContent = stats.pendingOrders;
        document.getElementById("statActiveProducts").textContent = stats.activeProducts;
        document.getElementById("statTotalOrders2").textContent = stats.totalOrders;

        const latestBody = document.getElementById("latestOrdersBody");
        if (stats.latestOrders.length === 0) {
            latestBody.innerHTML = `<tr><td colspan="4">No orders yet.</td></tr>`;
        } else {
            latestBody.innerHTML = stats.latestOrders
                .map(
                    (o) => `
                <tr>
                    <td>#${o.id}</td>
                    <td>${escapeHtml(o.customer.name)}</td>
                    <td><span class="status ${statusClass(o.status)}">${escapeHtml(o.status[0].toUpperCase() + o.status.slice(1))}</span></td>
                    <td>${formatMoney(o.total)}</td>
                </tr>
            `
                )
                .join("");
        }
    } catch (err) {
        console.error("Could not load dashboard stats", err);
    }

    try {
        const res = await fetch("/api/admin/customers", { credentials: "include" });
        if (!res.ok) return;
        const customers = await res.json();
        const list = document.getElementById("recentCustomersList");
        if (customers.length === 0) {
            list.innerHTML = `<div class="customer"><div><p>No customers yet. They'll appear here after the first order.</p></div></div>`;
            return;
        }
        list.innerHTML = customers
            .slice(0, 5)
            .map(
                (c) => `
            <div class="customer">
                <img src="../assets/logo.png">
                <div>
                    <h4>${escapeHtml(c.name)}</h4>
                    <p>${c.ordersCount} order${c.ordersCount === 1 ? "" : "s"} · ${formatMoney(c.totalSpent)}</p>
                </div>
            </div>
        `
            )
            .join("");
    } catch (err) {
        console.error("Could not load customers", err);
    }
}

loadDashboard();
