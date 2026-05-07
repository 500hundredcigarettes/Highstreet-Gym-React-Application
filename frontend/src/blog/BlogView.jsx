import { useEffect, useState } from "react"
import { useAuthenticate } from "../authentication/useAuthenticate"
import { useNavigate } from "react-router"
import { FaPlus, FaRegWindowClose, FaTrashAlt } from "react-icons/fa";
import { fetchAPI } from "../api.mjs"



export const Blog = ({
  allPosts
}) => {
  const navigate = useNavigate()
  const { user } = useAuthenticate()
  const [showCreatePopup, setCreatePopup] = useState(false)
  const [content, setContent] = useState("")
  const [postStatus, setPostStatus] = useState("")
  
  const toggleCreate = () => {
    setCreatePopup(!showCreatePopup)
    setPostStatus("")
    setContent("")
  }

  const handleSubmit = (e) => {
    const id = user.id
    e.preventDefault();
    if (content.trim() !== "") {
      fetchAPI("POST", "/posts/create", {
        content,
        id
      }).then(response => {
        setPostStatus(response.body.message)
        if (response.body.message.includes("success")) {
          toggleCreate()
          navigate(0)
        }
      })
    } else {
      setPostStatus("Post cannot be empty")
    }
  }

  const handleDelete = (postId) => {
    fetchAPI("DELETE", "/posts/delete", { postId }).then(() => navigate(0))
  }

  return (
    <section className="flex flex-col">
      {allPosts.map((post) => {
        return (
          <div key={post.id}>
            <div className="flex justify-between items-start my-15 mx-3">
              <div>
                <p className="text-xl">{post.userId.firstName} {post.userId.lastName}:</p>
                <p className="text-lg mt-4">{post.postContent}</p>
              </div>
              {post.userId.id === user.id && (
                <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700">
                  <FaTrashAlt />
                </button>
              )}
            </div>
            <span className="bg-sky-300 h-0.5 block"></span>
          </div>
        )
      }).reverse()}
      <div className="flex justify-end">
        <button className={showCreatePopup ? "text-3xl bg-sky-300 text-white p-2.5 mt-6 mr-6 rounded-full fixed top-10 z-100" : "text-3xl bg-sky-300 text-white p-2.5 mt-6 mr-6 rounded-full fixed bottom-35"} onClick={toggleCreate}>
          {showCreatePopup ? <FaRegWindowClose /> : <FaPlus />}
        </button>
      </div>

      {showCreatePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-md">
            <h2 className="text-xl font-medium mb-4 text-gray-800">Create New Post</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                className="w-full h-32 p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300"
                rows="8"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                name="content"
                id="post-content"
                placeholder="Write your post here..."
              ></textarea>
              {postStatus && <p className={postStatus.includes("success") ? "text-green-500 mt-2" : "text-red-500 mt-2"}>{postStatus}</p>}
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" onClick={toggleCreate} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">
                  Cancel
                </button>
                <button type="submit" className="bg-sky-300 text-white px-4 py-2 rounded-md hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300">
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Blog