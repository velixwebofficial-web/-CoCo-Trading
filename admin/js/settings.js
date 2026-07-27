document.getElementById("securityForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!newPassword || newPassword.length < 6) {
        showToast("Password must be at least 6 characters.", "error");
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast("Passwords do not match.", "error");
        return;
    }

    try {
        const res = await fetch("/api/admin/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ newPassword }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Could not update password.");
        }

        showToast("Password updated successfully.", "success");
        document.getElementById("securityForm").reset();
    } catch (err) {
        showToast(err.message, "error");
    }
});
