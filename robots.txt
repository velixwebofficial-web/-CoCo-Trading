# =====================================
# robots.txt
# WQ Wholesale
# =====================================

User-agent: *

Allow: /

# منع أرشفة لوحة التحكم

Disallow: /admin/

# منع الملفات الحساسة

Disallow: /config/
Disallow: /private/
Disallow: /.git/
Disallow: /node_modules/

# السماح بالصور وملفات CSS و JS

Allow: /assets/
Allow: /css/
Allow: /js/

# رابط Sitemap

Sitemap: https://www.wqwholesale.com/sitemap.xml