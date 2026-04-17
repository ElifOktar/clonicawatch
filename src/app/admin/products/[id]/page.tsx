"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setProduct(data.product);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="text-ink-muted py-12">Yukleniyor...</div>;
  if (error) return <div className="text-red-400 py-12">Hata: {error}</div>;
  if (!product) return <div className="text-red-400 py-12">Urun bulunamadi</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Urun Duzenle</h1>
        <p className="text-ink-muted text-sm mt-1">{product.model_name}</p>
      </div>
      <ProductForm mode="edit" initialData={product} />
    </div>
  );
}
