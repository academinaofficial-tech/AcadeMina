import type { Metadata } from "next";
import LegacyPage from "@/components/LegacyPage";

export const metadata: Metadata = {
  title: "商品詳細 | AcadeMina",
};

const html = "\n<div id=\"common-header\"></div>\n<div class=\"breadcrumb\" id=\"breadcrumb\">TOP &gt; 院試対策 &gt; ...</div>\n<div class=\"product-layout\">\n<div class=\"product-main\" id=\"product-main\"></div>\n<div class=\"product-panel\" id=\"product-panel\"></div>\n</div>\n<div id=\"common-footer\"></div>\n\n\n\n";
const css = ":root{--bg:#fff;--text:#111;--text-inv:#fff;--accent:#0044cc;--accent-light:#4da6ff;--gray:#f4f4f4;--border:#e0e0e0;--font:\"Helvetica Neue\",Arial,\"Hiragino Kaku Gothic ProN\",\"Hiragino Sans\",Meiryo,sans-serif}\n        *{box-sizing:border-box;margin:0;padding:0}body{font-family:var(--font);background:#f9f9f9;color:var(--text);line-height:1.6}a{text-decoration:none;color:inherit;transition:opacity .3s}a:hover{opacity:.7}\n\n        .breadcrumb{margin-top:70px;padding:15px 40px;font-size:.8rem;color:#666;background:#fff;border-bottom:1px solid var(--border)}\n        .breadcrumb a{color:var(--accent);font-weight:600}\n\n        .product-layout{display:flex;max-width:1100px;margin:30px auto;padding:0 20px;gap:40px;align-items:flex-start}\n        .product-main{flex:1;min-width:0}\n        .product-panel{width:340px;flex-shrink:0;position:sticky;top:100px}\n\n        .product-img{width:100%;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#eee;margin-bottom:30px}\n        .product-img img{width:100%;height:100%;object-fit:cover}\n\n        .product-title{font-size:1.8rem;font-weight:800;line-height:1.4;margin-bottom:15px}\n\n        .section-label{font-size:1.2rem;font-weight:800;margin-bottom:15px;padding-bottom:8px;border-bottom:2px solid var(--text)}\n        .product-desc{margin-bottom:30px;font-size:1rem;line-height:1.9;color:#444}\n        .contents-list{list-style:none;margin-bottom:30px}\n        .contents-list li{padding:12px 0;border-bottom:1px solid #eee;display:flex;align-items:center;gap:10px;font-size:.95rem}\n        .contents-list li::before{content:\"✓\";color:var(--accent);font-weight:700}\n        .preview-box{background:#fff;border:1px solid var(--border);border-radius:8px;padding:25px;margin-bottom:30px;font-size:.95rem;color:#555;line-height:1.9}\n\n        /* Panel */\n        .panel-card{background:#fff;border:1px solid var(--border);border-radius:12px;padding:30px;box-shadow:0 4px 20px rgba(0,0,0,.05)}\n        .panel-price{font-size:2rem;font-weight:800;margin-bottom:5px}\n        .panel-original{text-decoration:line-through;color:#999;font-size:1rem;margin-left:8px}\n        .panel-tax{font-size:.8rem;color:#999;margin-bottom:20px}\n        .btn-primary{display:block;width:100%;padding:16px;background:var(--accent);color:#fff;border:none;border-radius:50px;font-size:1.1rem;font-weight:700;cursor:pointer;margin-bottom:10px;transition:all .2s}\n        .btn-primary:hover{background:#003399;transform:translateY(-1px)}\n        .btn-secondary{display:block;width:100%;padding:14px;background:var(--text);color:#fff;border:none;border-radius:50px;font-size:1rem;font-weight:600;cursor:pointer;margin-bottom:20px;transition:all .2s}\n        .btn-secondary:hover{opacity:.85}\n        .btn-wish{display:block;width:100%;padding:12px;background:none;border:1px solid var(--border);border-radius:50px;font-size:.9rem;cursor:pointer;margin-bottom:20px}\n        .btn-wish:hover{border-color:var(--accent);color:var(--accent)}\n\n        @media(max-width:768px){\n        .breadcrumb{padding:15px 20px}.product-layout{flex-direction:column}.product-panel{width:100%;position:static}.product-title{font-size:1.4rem}}";
const scripts = [
  {
    "src": "/store-data.js"
  },
  {
    "src": "/scripts/product__inline1.js"
  },
  {
    "src": "/common.js"
  }
];

export default function Page() {
  return <LegacyPage html={html} css={css} scripts={scripts} />;
}
