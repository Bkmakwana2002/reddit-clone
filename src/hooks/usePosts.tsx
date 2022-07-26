import React from 'react';
import { useRecoilState } from 'recoil';
import { postState } from '../atoms/postAtom';


const usePosts = () => {

    const [postStateValue, setPostStateValue] = useRecoilState(postState)

    const onVote = async ()=>{

    }

    const onSelect = () =>{

    }

    const onDelete = async()=>[

    ]
    
    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelect,
        onDelete
    }
}
export default usePosts;