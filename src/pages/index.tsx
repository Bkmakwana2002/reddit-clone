import { Stack } from '@chakra-ui/react'
import { collection, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilValue } from 'recoil'
import { communityState } from '../atoms/communititesAtom'
import { Post } from '../atoms/postAtom'
import CreatePostLink from '../components/community/CreatePostLink'
import PageContext from '../components/Layout/PageContext'
import PostItem from '../components/Posts/PostItem'
import PostLoader from '../components/Posts/PostLoader'
import { auth, firestore } from '../firebase/clientApp'
import usePosts from '../hooks/usePosts'

const Home: NextPage = () => {

  const [user, loadingUser] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const communitySateValue = useRecoilValue(communityState)
  const { setPostStateValue,postStateValue,onSelect,onDelete,onVote } = usePosts()

  const buildUserHomeFeed = async() => {
    setLoading(true)
     try {
      if(communitySateValue.mySnippets.length){
       const myCommunititesIds = communitySateValue.mySnippets.map(snippet=>snippet.communityId)
       const postQuery = query(collection(firestore,'posts'),where('communityId','in',myCommunititesIds),limit(10))
       const postDocs = await getDocs(postQuery) 
       const posts = postDocs.docs.map(doc=>({ id:doc.id,...doc.data() }))

       setPostStateValue(prev=>({
        ...prev,
        posts:posts as Post[]
       }))
      }
      else{
        buildNoUserHomeFeed()
      }
     } catch (error: any) {
      
     }
     setLoading(false)
  }

  const buildNoUserHomeFeed = async () => {
    setLoading(true)
    try {

      const postQuey = query(collection(firestore, 'posts'), orderBy('voteStatus', 'desc'), limit(10))
      const postDocs = await getDocs(postQuey)
      const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPostStateValue(prev=>({
        ...prev,
        posts: posts as Post[]
      }))


    } catch (error: any) {
      console.log(error.message)
    }
    setLoading(false)
  }

  const getUserPostVotes = () => {
     
  }

  useEffect(()=>{

  },[communitySateValue.mySnippets])

  useEffect(() => {
    if (!user && !loadingUser) {
      buildNoUserHomeFeed()
    }

  }, [user, loadingUser])

  return (
    <PageContext>
      <>
      <CreatePostLink/>
        {
          loading ? (
              <PostLoader/>
          ):(
             <Stack>
                {postStateValue.posts.map(post=>(
                  <PostItem key={post.id} post={post}  onSelectPost={onSelect} onDeletePost={onDelete} onVote={onVote} userVoteValue={postStateValue.postVotes.find(item=>item.postId === post.id)?.voteValue} userIsCreator={user?.uid === post.creatorId} homePage />
                ))}
             </Stack>
          )
        }
      </>
      <>
        Recomendation
      </>
    </PageContext>
  )
}

export default Home
