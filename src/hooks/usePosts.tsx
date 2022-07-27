import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { authModalState } from '../atoms/authModalRecoil';
import { communityState } from '../atoms/communititesAtom';
import { Post, postState, PostVote } from '../atoms/postAtom';
import { auth, firestore, storage } from '../firebase/clientApp';


const usePosts = () => {

    const [postStateValue, setPostStateValue] = useRecoilState(postState)
    const [user] = useAuthState(auth)
    const currentCommunity = useRecoilValue(communityState).currentCommunity
    const setAuthModalState = useSetRecoilState(authModalState)
    const router = useRouter()

    const onVote = async (event:React.MouseEvent<SVGElement,MouseEvent>,post: Post, vote: number, communityId: string) => {
         
        event.stopPropagation()
        if(!user?.uid)
        {
           setAuthModalState({ 
            open:true,
            view:'login'
           })
           return;
        }

        try {
         
            const { voteStatus } = post
            const existingVote = postStateValue.postVotes.find(vote=>vote.postId === post.id)

            const batch = writeBatch(firestore)
            const updatedPost = { ...post }
            const updatedPosts = [...postStateValue.posts]
            let updatedPostVotes = [...postStateValue.postVotes]
            let voteChange = vote

            if (!existingVote) {
               const postVoteRef = doc(collection(firestore,'Users',`${user?.uid}/postVotes`))

               const newVote:PostVote = {
                id:postVoteRef.id,
                postId: post.id!,
                communityId,
                voteValue:vote
               }

               console.log(newVote)

               batch.set(postVoteRef,newVote)

               updatedPost.voteStatus = voteStatus + vote
               updatedPostVotes = [...updatedPostVotes,newVote]
            }
            else {
 
                const postVoteRef = doc(firestore,'Users',`${user?.uid}/postVotes/${existingVote.id}`)
                console.log("existingVote",existingVote)

                if (existingVote.voteValue === vote) {
                     voteChange *= -1
                     updatedPost.voteStatus = voteStatus - vote
                     updatedPostVotes = updatedPostVotes.filter(item=> item.postId !== existingVote.id)
                     batch.delete(postVoteRef)
                }
                else {
                    voteChange  = 2 * vote
                    updatedPost.voteStatus = voteStatus + 2*vote
                    const voteIndex = postStateValue.postVotes.findIndex(item=>item.id === existingVote.id)

                    updatedPostVotes[voteIndex] = {
                        ...existingVote,
                        voteValue:vote
                    }
                    batch.update(postVoteRef,{
                        voteValue: vote
                    })
                }
            }


            const postIndex = postStateValue.posts.findIndex(item=>item.id === post.id)
            updatedPosts[postIndex] = updatedPost
            setPostStateValue((prev)=>({
                ...prev,
                posts: updatedPosts,
                postVotes: updatedPostVotes,
            }))

            if(postStateValue.selectedPost){
                setPostStateValue(prev=>({
                    ...prev,
                    selectedPost: updatedPost
                }))
            }

            const postRef = doc(firestore,'posts',post.id!)
            batch.update(postRef,{
                voteStatus:voteChange+voteStatus
            })

            await batch.commit()

        } catch (error:any) {
            console.log("voting error",error.message)
        }

    }

    const getCommunityPostVotes = async(communityId:string)=>{
      const postVotesQuery = query(collection(firestore,'Users',`${user?.uid}/postVotes`),where('communityId','==',communityId))

      const postVoteDocs = await getDocs(postVotesQuery)
      const postVotes = postVoteDocs.docs.map(doc=>({ id:doc.id,...doc.data() }))
      setPostStateValue(prev=>({
        ...prev,
        postVotes:postVotes as PostVote[]
      }))
    }

    useEffect(() => {
        if(!user || !currentCommunity?.id) return;
       getCommunityPostVotes(currentCommunity?.id)
    }, [user,currentCommunity])
    
    useEffect(() => {
      if(!user)
      {
        setPostStateValue((prev)=>({
            ...prev,
            postVotes:[],
        }))
      }
    }, [user])
    

    const onSelect = (post:Post) => {
        setPostStateValue(prev=>({
            ...prev,
            selectedPost:post
        }))
        router.push(`/r/${post.communityId}/comments/${post.id}`)
    }

    const onDelete = async (post: Post): Promise<boolean> => {
        try {

            if (post.imageUrl) {
                const imgRef = ref(storage, `posts/${post.id}/image`)
                await deleteObject(imgRef)
            }

            const postDocRef = doc(firestore, 'posts', post.id!)
            await deleteDoc(postDocRef)

            setPostStateValue(prev => ({
                ...prev,
                posts: prev.posts.filter(item => post.id !== item.id)
            }))

            return true
        } catch (error) {
            return false
        }
    }

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelect,
        onDelete
    }
}
export default usePosts;