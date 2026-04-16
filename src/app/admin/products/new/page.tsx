"use client";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Yeni Urun Ekle</h1>
        <p className="text-ink-muted text-sm mt-1">Tum alanlari doldurun, yildizli alanlar zorunludur</p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
