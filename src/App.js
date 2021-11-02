import React, { useEffect, useState } from "react"
import PostList from "./components/UI/PostList";
import PostForm from "./components/UI/PostForm";
import './styles/App.css'
import PostFilter from "./components/UI/PostFilter";
import MyModal from "./components/UI/modal/MyModal";
import MyButton from "./components/UI/buttons/MyButton";
import {usePosts} from "./hooks/usePosts"
import PostService from "./API/PostService";
import Loader from "./components/UI/loader/Loader";
import { useFetching } from "./hooks/useFetching";
import { getPageCount } from "./utils/page";
import { getPagesArr } from "./utils/page";
import Pagination from "./components/UI/pagination/Pagination";

function App() {

  const [posts, setPosts] = useState([
    // {id: 1, title: 'JavaScript', body: 'Description'},
  ]);

  const [filter, setFilter] = useState({sort: '', query: ''});
  const [modal, setModal] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  
  const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
    const response = await PostService.getAll(limit, page);
    setPosts(response.data);
    const totalCount = response.headers['x-total-count'];
    setTotalPage(getPageCount(totalCount, limit));
  });

  const createPost = (newPost) => {
    setPosts([...posts, newPost]);
    setModal(false);
  }

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id));
  }

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <div className="App">
      <MyButton style={{marginTop: '30px'}} onClick={() => setModal(true)}>
        Создать пользователя
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost}/>
      </MyModal>
      <hr style={{margin: '15px 0'}}/>
      <PostFilter 
        filter={filter}
        setFilter={setFilter}
      />
      {postError && 
        <h1>Error ${postError}</h1>
      }
      {isPostsLoading
        ? <div style={{display: 'flex', justifyContent: 'center', marginTop: '30px'}}>
          <Loader/>
        </div> 
        : <PostList 
            remove={removePost} 
            posts={sortedAndSearchedPosts} 
            title={'Посты про JS'}
          />
      }
      <Pagination 
        page={page} 
        setPage={setPage} 
        totalPage={totalPage}
      />    
    </div>
  );
}

export default App;
