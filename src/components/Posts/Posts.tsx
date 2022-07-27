import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Community } from '../../atoms/communititesAtom';
import { Post } from '../../atoms/postAtom';
import { auth, firestore } from '../../firebase/clientApp';
import usePosts from '../../hooks/usePosts';
import PostItem from './PostItem';
import PostLoader from './PostLoader';

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {

  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const { postStateValue, setPostStateValue, onVote, onDelete, onSelect } = usePosts()

  const getPost = async () => {
    try {
      setLoading(true)
      const postQuery = query(collection(firestore, 'posts'), where('communityId', '==', communityData.id), orderBy('createdAt', 'desc'))

      const postDocs = await getDocs(postQuery)
      const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPostStateValue(prev => ({
        ...prev,
        posts: posts as Post[]
      }))

      console.log("posts", posts)
    } catch (error: any) {
      console.log("getPost error", error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    getPost()
  }, [])


  return (
    <>
      {loading ? (
        < PostLoader />
      ) :
        (<Stack>
          {postStateValue.posts.map((item, index) => <PostItem key={index} post={item} userIsCreator={user?.uid === item.creatorId} userVoteValue={postStateValue.postVotes.find((vote)=>vote.postId === item.id)?.voteValue} onVote={onVote} onSelectPost={onSelect} onDeletePost={onDelete} />)}
        </Stack>)}
    </>
  )
}
export default Posts;