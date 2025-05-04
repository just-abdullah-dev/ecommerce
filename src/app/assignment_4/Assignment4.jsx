"use client";
import React, { useEffect, useState } from "react";

const Assignment4 = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    _id: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/v1/category");
      const data = await res.json();
      console.log(data);

      if (data?.success) {
        setCategories(data?.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = isEditing ? "PUT" : "POST";
    const endpoint = "/api/v1/category";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setForm({ name: "", slug: "", description: "", _id: null });
      setIsEditing(false);
      fetchCategories();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async (_id) => {
    try {
      await fetch(`/api/v1/category?_id=${_id}`, { method: "DELETE" });
      fetchCategories();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Start editing
  const handleEdit = (category) => {
    setForm({ ...category, id: category._id });
    setIsEditing(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Manager</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border p-2 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="slug"
            placeholder="Slug"
            className="border p-2 rounded"
            value={form.slug}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            className="border p-2 rounded"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isEditing ? "Update Category" : "Add Category"}
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t">
                <td className="px-4 py-2">{cat.name}</td>
                <td className="px-4 py-2">{cat.slug}</td>
                <td className="px-4 py-2">{cat.description}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignment4;
