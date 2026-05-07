import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"
import { useAuthenticate } from "../authentication/useAuthenticate.jsx";
import { fetchAPI } from "../api.mjs";
import Blog from "./BlogView.jsx";


export function BlogPage() {

const [allPosts, setAllPosts] = useState([])
//  const { clearSessionId } = handleSessionBooking();
  useEffect(() => {
    fetchAPI("GET", "/posts").then(response => {
      setAllPosts(response.body)
    })
  }, [setAllPosts]) 
  
  if (!allPosts) {
    return <div>Loading posts...</div>;
  }
  
return (

  <div>
    <Blog allPosts={allPosts}></Blog>
  </div>
);

}

export default BlogPage;