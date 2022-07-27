import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Post } from '../../../../atoms/postAtom';
import PageContext from '../../../../components/Layout/PageContext';
import PostItem from '../../../../components/Posts/PostItem';
import { auth, firestore } from '../../../../firebase/clientApp';
import usePosts from '../../../../hooks/usePosts';


const PostPage:React.FC = () => {

    const [user] = useAuthState(auth)
    const router = useRouter()
    const { postStateValue,setPostStateValue,onDelete,onVote } = usePosts()
    
    const fetchPost = async(postId:string)=> {
        try {
            const postDofRef = doc(firestore,'posts',postId)
            const postDoc = await getDoc(postDofRef)
            setPostStateValue(prev=>({
                ...prev,
                selectedPost: { id: postDoc.id,...postDoc.data() } as Post
            }))
        } catch (error:any) {
            console.log("fetchPostError",error.message)
        }
    }

    useEffect(() => {
       const { pid } = router.query
       if(pid && !postStateValue.selectedPost){
        fetchPost(pid as string)
       }
    }, [router.query,postStateValue.selectedPost])
    
     
    return (
        <PageContext>
            <>
             { postStateValue.selectedPost &&  (<PostItem post={postStateValue.selectedPost} onVote={onVote} onDeletePost={onDelete} userVoteValue={ postStateValue.postVotes.find(item=>item.postId === postStateValue.selectedPost?.id)?.voteValue }
                userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
              />) }
              comments
            </>
            <>
              About
            </>
        </PageContext>
    )
}
export default PostPage;