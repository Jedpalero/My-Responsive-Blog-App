import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogSection from "../components/BlogSection";
import { db } from "../firebase";
import Spinner from "../components/Spinner";

const CategoryBlog = ({ setActive }) => {
  const [categoryBlogs, setCategoryBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { category } = useParams();

  const getCategoryBlogs = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const categoryBlogQuery = query(blogRef, where("category", "==", category));
    const docSnapshot = await getDocs(categoryBlogQuery);
    let categoryBlogs = [];
    docSnapshot.forEach((doc) => {
      categoryBlogs.push({ id: doc.id, ...doc.data() });
    });
    setCategoryBlogs(categoryBlogs);
    setLoading(false);
  };

  useEffect(() => {
    getCategoryBlogs();
    setActive(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="blog-heading text-center py-2 mb-4">
            Category: <strong>{category.toLocaleUpperCase()}</strong>
          </div>
          {categoryBlogs?.map((item) => (
            <div className="col-md-6">
              <BlogSection key={item.id} {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBlog;
